// src/ComponentsTests/AIChat.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIChat from '../Pages/GPTChatBot';
import OpenAI from 'openai';

// Stub react-router hooks so MainLayout’s sidebar can render
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

// Mock the OpenAI client
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mock AI response' } }],
        }),
      },
    },
  }));
});

describe('AIChat Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial UI', () => {
    render(<AIChat />);

    expect(screen.getByText('Your AI ChatBot')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Question ?')).toBeInTheDocument();
    // initial greeting is in a Textarea with that value
    expect(screen.getByDisplayValue('How may i Help you Today ?')).toBeInTheDocument();
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

    // wait for OpenAI() to be called
    await waitFor(() => expect(OpenAI).toHaveBeenCalled());

    // the human message should now render in a textarea
    expect(screen.getByDisplayValue('Test message')).toBeInTheDocument();
  });


  test('displays AI response after submission', async () => {
    render(<AIChat />);
    const input = screen.getByPlaceholderText('Enter your Question ?');

    fireEvent.change(input, { target: { value: 'Replay to this with YES SIR' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // wait for the mock AI response to render
    await waitFor(() =>
      expect(OpenAI).toHaveBeenCalled(),
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
    // Next call will reject
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

    // Even on error, the human bubble shows up
    await waitFor(() =>
      expect(screen.getByDisplayValue('Error case')).toBeInTheDocument()
    );
  });

  test('renders human messages on the right, AI on the left', async () => {
    render(<AIChat />);
    const input = screen.getByPlaceholderText('Enter your Question ?');

    // Send a human message
    fireEvent.change(input, { target: { value: 'Reply to this with HELLO PEOPLE' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    await waitFor(() => expect(OpenAI).toHaveBeenCalled());

    // Find the human bubble and assert its wrapper has justify-end
    const human = screen.getByDisplayValue('Reply to this with HELLO PEOPLE');
    const humanWrapper = human.closest('div.flex');
    expect(humanWrapper).toHaveClass('justify-end');

    // Then assert the AI bubble uses justify-start
    const ai = screen.getByDisplayValue('HELLO PEOPLE');
    const aiWrapper = ai.closest('div.flex');
    expect(aiWrapper).toHaveClass('justify-start');
  });
});
