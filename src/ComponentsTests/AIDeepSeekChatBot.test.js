import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIChatDeepSeek from '../Pages/DeepSeekChatBot';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock axios and other dependencies
jest.mock('axios');
jest.mock('../CommonElements/MainLayout', () => ({ children }) => <div>{children}</div>);

describe('AIChatDeepSeek Component - Chat Response Tests', () => {
  const mockApiResponse = {
    data: {
      choices: [{
        message: {
          content: "Here's the AI response to your query"
        }
      }]
    }
  };
    const mockApiResponse2 = {
    data: {
      choices: [{
        message: {
          content: "Reply to this with NO SIR"
        }
      }]
    }
  };

  const API_URL = process.env.REACT_APP_DEEPSEEK_API_URL;
  const API_KEY = process.env.REACT_APP_DEEPSEEKAPI_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays initial AI greeting message', () => {
    render(
      <MemoryRouter>
        <AIChatDeepSeek />
      </MemoryRouter>
    );
    expect(screen.getByDisplayValue('How may i Help you Today ?')).toBeInTheDocument();
  });

  test('sends user message and displays AI response', async () => {
    axios.post.mockResolvedValue(mockApiResponse);
    render(
      <MemoryRouter>
        <AIChatDeepSeek />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'user', content: 'Test question' })
          ]),
          model: 'deepseek-chat',
          max_tokens: expect.any(Number),
          temperature: expect.any(Number)
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          })
        })
      );
    });
    await waitFor(() => {
      expect(screen.getByText("Here's the AI response to your query")).toBeInTheDocument();
    });
  });

  test('clears input after sending message and calls API', async () => {
    axios.post.mockResolvedValue(mockApiResponse);
    render(
      <MemoryRouter>
        <AIChatDeepSeek />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'user', content: 'Test message' })
          ]),
          model: 'deepseek-chat'
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          })
        })
      );
    });
    await waitFor(() => expect(input).toHaveValue(''));
  });

   test('renders human messages on the right, AI on the left and calls API', async () => {
    axios.post.mockResolvedValue(mockApiResponse2);
    render(
      <MemoryRouter>
        <AIChatDeepSeek />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Reply to this with NO SIR' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // wait for API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        API_URL,
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'user', content: 'Reply to this with NO SIR' })
          ]),
          model: 'deepseek-chat'
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          })
        })
      );
    });

    // wait for messages
    const userMsg = await screen.findByText('Reply to this with NO SIR');
    const aiMsg = await screen.findByText("Here's the AI response to your query");

    const userContainer = userMsg.closest('.chat-message');
    const aiContainer = aiMsg.closest('.chat-message');

    expect(userContainer).toHaveClass('justify-end');
    expect(aiContainer).toHaveClass('justify-start');
  });
});
