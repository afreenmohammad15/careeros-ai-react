import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import Home from './pages/Home';
import Jobs from './pages/Jobs';

test('renders the resume-focused CareerOS landing page without the homepage job search panel', () => {
  window.location.hash = '';
  render(<App />);
  expect(screen.getByRole('heading', { name: /Turn your experience into your next opportunity/i })).toBeInTheDocument();
  expect(screen.getByText(/100\+/)).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: /What kind of role are you looking for/i })).not.toBeInTheDocument();
  expect(screen.queryByText(/SAMPLE WORKSPACE/i)).not.toBeInTheDocument();
});

test('landing page links directly to interview practice and job discovery', () => {
  render(<Home />);
  expect(screen.getByRole('link', { name: /See how interview practice works/i })).toHaveAttribute('href', '#interview-practice');
  expect(screen.getByRole('link', { name: /Find roles/i })).toHaveAttribute('href', '#jobs');
  window.location.hash = '';
});

test('lets signed-out visitors open live job searches without an account', async () => {
  window.localStorage.removeItem('careeros.token');
  window.sessionStorage.removeItem('careeros.token');
  window.location.hash = '#jobs';
  render(<App />);

  expect(await screen.findByRole('heading', { name: /Find real openings/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Search Naukri for Software Engineer in India/i })).toBeInTheDocument();
  await waitFor(() => expect(window.location.hash).toBe('#jobs'));
  window.location.hash = '';
});

test('signup is for job seekers and uses email credentials', () => {
  window.location.hash = '#signup';
  render(<App />);
  expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
  expect(screen.queryByText(/recruiter/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/google/i)).not.toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  window.location.hash = '';
});

test('login uses email credentials without an unconfigured Google option', () => {
  window.location.hash = '#login';
  render(<App />);
  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.queryByText(/google/i)).not.toBeInTheDocument();
  expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  window.location.hash = '';
});
