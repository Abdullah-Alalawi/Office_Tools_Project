// src/ComponentsTests/AIChat.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIChat from '../Pages/GPTChatBot';
import OpenAI from 'openai';

// 1️⃣ Stub out react-router hooks so MainLayout can render
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

// 2️⃣ Default mock for OpenAI – returns "YES SIR"
jest.mock('openai', () =>
  jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'YES SIR' } }],
        }),
      },
    },
  }))
);


describe('AIChat Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial UI', () => {
    render(<AIChat />);

    expect(screen.getByText('Your AI ChatBot')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your Question ?')
    ).toBeInTheDocument();
    // initial greeting is rendered in a Textarea
    expect(
      screen.getByDisplayValue('How may i Help you Today ?')
    ).toBeInTheDocument();
  });

  test('updates input on change', () => {
    render(<AIChat />);
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(input).toHaveValue('Test message');
  });

  test('submits on Enter key press', async () => {
    render(<AIChat />);
    const input = screen.getByPlaceholderText('Enter your Question ?');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // wait for the OpenAI constructor to be called
    await waitFor(() => expect(OpenAI).toHaveBeenCalled());

    // and the human bubble appears
    expect(
      screen.getByDisplayValue('Test message')
    ).toBeInTheDocument();
  });

  test('displays AI response after submission', async () => {
    render(<AIChat />);

    const input = screen.getByPlaceholderText('Enter your Question ?');
        OpenAI.mockImplementationOnce(() => ({
        chat: {
            completions: {
            create: jest.fn().mockResolvedValue({
                choices: [{ message: { content: 'YES SIR' } }],
            }),
            },
        },
        }));

    fireEvent.change(input, { target: { value: 'reply to this with YES SIR' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // first wait for the OpenAI call
    await waitFor(() => expect(OpenAI).toHaveBeenCalled());

    // then wait for the AI bubble to render "YES SIR"
    await waitFor(() =>
      expect(screen.getByDisplayValue('YES SIR')).toBeInTheDocument()
    );
  });

  test('clears input after submission', async () => {
    render(<AIChat />);
    const input = screen.getByPlaceholderText('Enter your Question ?');

    fireEvent.change(input, { target: { value: 'Clear me' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => expect(input).toHaveValue(''));
  });

  test('handles API errors without crashing', async () => {
    // Next call to create() will reject
    OpenAI.mockImplementationOnce(() => ({
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error('API error')),
        },
      },
    }));

    render(<AIChat />);
    const input = screen.getByPlaceholderText('Enter your Question ?');

    fireEvent.change(input, { target: { value: 'Error case' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // even on error, the human bubble still shows up
    await waitFor(() =>
      expect(screen.getByDisplayValue('Error case')).toBeInTheDocument()
    );
  });


});
 
