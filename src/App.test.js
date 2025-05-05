// App.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';


// Mock the page components to verify rendering
jest.mock('./Pages/Translator', () => () => <div>Translator Page</div>);
jest.mock('./Pages/GPTChatBot', () => () => <div>GPT ChatBot Page</div>);
jest.mock('./Pages/DeepSeekChatBot', () => () => <div>DeepSeek ChatBot Page</div>);
jest.mock('./Pages/GrammarCorrection', () => () => <div>Grammar Checker Page</div>);
jest.mock('./LoginSection/Login', () => () => <div>Login Page</div>);
jest.mock('./LoginSection/PasswordResetPage', () => () => <div>Password Reset Page</div>);
jest.mock('./LoginSection/SendEmailPage', () => () => <div>Send Email Page</div>);
jest.mock('./LoginSection/OTPConfirmation', () => () => <div>OTP Confirmation Page</div>);

describe('App Component', () => {
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
  };

  test('renders Login page by default', () => {
    renderWithRouter(<App />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('navigates to Translator page when /Translator route is accessed', () => {
    renderWithRouter(<App />, { route: '/Translator' });
    expect(screen.getByText('Translator Page')).toBeInTheDocument();
  });

  test('navigates to GPT ChatBot page when /AIChatGPT route is accessed', () => {
    renderWithRouter(<App />, { route: '/AIChatGPT' });
    expect(screen.getByText('GPT ChatBot Page')).toBeInTheDocument();
  });

  test('navigates to DeepSeek ChatBot page when /AIChatDeepSeek route is accessed', () => {
    renderWithRouter(<App />, { route: '/AIChatDeepSeek' });
    expect(screen.getByText('DeepSeek ChatBot Page')).toBeInTheDocument();
  });

  test('navigates to Grammar Checker page when /GrammarChecker route is accessed', () => {
    renderWithRouter(<App />, { route: '/GrammarChecker' });
    expect(screen.getByText('Grammar Checker Page')).toBeInTheDocument();
  });

  test('navigates to Password Reset page when /PasswordReset route is accessed', () => {
    renderWithRouter(<App />, { route: '/PasswordReset' });
    expect(screen.getByText('Password Reset Page')).toBeInTheDocument();
  });

  test('navigates to Send Email page when /SendEmailPage route is accessed', () => {
    renderWithRouter(<App />, { route: '/SendEmailPage' });
    expect(screen.getByText('Send Email Page')).toBeInTheDocument();
  });

  test('navigates to OTP Confirmation page when /OTPConfirmation route is accessed', () => {
    renderWithRouter(<App />, { route: '/OTPConfirmation' });
    expect(screen.getByText('OTP Confirmation Page')).toBeInTheDocument();
  });

  test('redirects from root path to /Login', () => {
    renderWithRouter(<App />, { route: '/' });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('shows Login page for unknown routes', () => {
    renderWithRouter(<App />, { route: '/some-unknown-route' });
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});