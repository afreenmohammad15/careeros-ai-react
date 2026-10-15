import { unzipSync } from "fflate";

const MAX_DOCX_XML_SIZE = 1000000;

function readDocxText(data) {
  const files = unzipSync(data, {
    filter: (file) => {
      if (file.name !== "word/document.xml") return false;
      if (file.originalSize > MAX_DOCX_XML_SIZE) {
        throw new Error("The Word document contains too much text to import.");
      }
      return true;
    }
  });
  const documentXml = files["word/document.xml"];
  if (!documentXml) throw new Error("The Word document does not contain readable resume text.");

  const xml = new DOMParser().parseFromString(new TextDecoder().decode(documentXml), "application/xml");
  if (xml.querySelector("parsererror")) throw new Error("The Word document has invalid text formatting.");
  return Array.from(xml.getElementsByTagName("w:p"))
    .map((paragraph) => Array.from(paragraph.getElementsByTagName("w:t"))
      .map((text) => text.textContent || "")
      .join(""))
    .filter(Boolean)
    .join("\n");
}

async function readPdfText(file, maxTextLength) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
  const document = await pdfjs.getDocument({
    data: await file.arrayBuffer(),
    isEvalSupported: false
  }).promise;

  try {
    if (document.numPages > 100) throw new Error("The PDF has more than 100 pages.");
    const pages = [];
    let textLength = 0;
    for (let index = 0; index < document.numPages; index += 1) {
      const page = await document.getPage(index + 1);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str || "").join(" ");
      textLength += pageText.length + 1;
      if (textLength > maxTextLength) {
        throw new Error("The extracted text is over 100 KB. Shorten the resume before using it for practice.");
      }
      pages.push(pageText);
    }
    return pages.join("\n");
  } finally {
    await document.destroy();
  }
}

export async function readResumeFile(file, maxTextLength) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "txt") return file.text();
  if (extension === "docx") return readDocxText(new Uint8Array(await file.arrayBuffer()));
  if (extension === "pdf") return readPdfText(file, maxTextLength);
  throw new Error("Choose a PDF, DOCX, or plain-text resume.");
}
