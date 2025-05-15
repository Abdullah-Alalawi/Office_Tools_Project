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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays initial AI greeting message', () => {
    render(
      <MemoryRouter>
        <AIChatDeepSeek />
      </MemoryRouter>
    );
    
    expect(
      screen.getByDisplayValue('How may i Help you Today ?')
    ).toBeInTheDocument();
  });

  test('sends user message and displays AI response', async () => {
    axios.post.mockResolvedValue(mockApiResponse);

    render(
      <MemoryRouter>
        <AIChatDeepSeek />
      </MemoryRouter>
    );

    // Simulate user sending a message
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Verify API call
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        process.env.REACT_APP_DEEPSEEK_API_URL,
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: "user",
              content: "Test question"
            })
          ])
        }),
        expect.any(Object)
      );
    });

    // Verify AI response appears
    await waitFor(() => {
      expect(screen.getByText("Here's the AI response to your query")).toBeInTheDocument();
    });
  });

  
  test('clears input after sending message', async () => {
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
      expect(input).toHaveValue('');
    });
  });
});