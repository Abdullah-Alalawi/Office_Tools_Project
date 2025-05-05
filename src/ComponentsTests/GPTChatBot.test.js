// AIChat.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIChat from '../Pages/GPTChatBot';
import OpenAI from 'openai';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{
            message: {
              content: "Mock AI response"
            }
          }]
        })
      }
    }
  }));
});

// Mock other dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('jwt-decode');

describe('AIChat Component', () => {
  const mockNavigate = jest.fn();
  const mockToken = { exp: Math.floor(Date.now() / 1000) + 3600 }; // Valid token

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn((key) => {
      switch (key) {
        case 'Token': return 'mockToken';
        case 'Name': return 'Test User';
        case 'Major': return 'Student';
        default: return null;
      }
    });

    // Mock jwtDecode
    jwtDecode.mockReturnValue(mockToken);
    
    // Mock useNavigate
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', () => {
    render(<AIChat />);
    
    expect(screen.getByText('Your AI ChatBot')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Question ?')).toBeInTheDocument();
    expect(screen.getByText('How may i Help you Today ?')).toBeInTheDocument();
  });

  test('checks for authentication and redirects if not authenticated', () => {
    // Simulate expired token
    jwtDecode.mockReturnValueOnce({ exp: Math.floor(Date.now() / 1000) - 3600 });
    
    render(<AIChat />);
    
    expect(mockNavigate).toHaveBeenCalledWith('/LOGIN');
    expect(localStorage.setItem).toHaveBeenCalledWith('Token', '');
    expect(localStorage.setItem).toHaveBeenCalledWith('Name', '');
    expect(localStorage.setItem).toHaveBeenCalledWith('Major', '');
  });

  test('updates chat message on input change', () => {
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    expect(input).toHaveValue('Test message');
  });

  test('submits message on enter key press', async () => {
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(OpenAI).toHaveBeenCalled();
      expect(screen.getAllByText('Test message')).toHaveLength(1);
    });
  });

  test('submits message on send button click', async () => {
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByRole('button');
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(OpenAI).toHaveBeenCalled();
      expect(screen.getAllByText('Test message')).toHaveLength(1);
    });
  });

  test('displays AI response after submission', async () => {
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(screen.getByText('Mock AI response')).toBeInTheDocument();
    });
  });

  test('clears input after submission', async () => {
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  test('handles API errors gracefully', async () => {
    OpenAI.mockImplementationOnce(() => ({
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error('API error'))
        }
      }
    }));
    
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // The component should handle the error without crashing
    await waitFor(() => {
      expect(screen.getAllByText('Test message')).toHaveLength(1);
    });
  });

  test('renders messages with correct styling based on sender', async () => {
    render(<AIChat />);
    
    // Check initial AI message
    const aiMessage = screen.getByText('How may i Help you Today ?');
    expect(aiMessage).toBeInTheDocument();
    expect(aiMessage.closest('div')).toHaveClass('justify-start');
    
    // Send a user message
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    await waitFor(() => {
      const userMessage = screen.getByText('Test message');
      expect(userMessage).toBeInTheDocument();
      expect(userMessage.closest('div')).toHaveClass('justify-end');
    });
  });
});