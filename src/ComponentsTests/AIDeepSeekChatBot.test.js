import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIChatDeepSeek from '../Pages/DeepSeekChatBot';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock layout component only 
jest.mock('../CommonElements/MainLayout', () => ({ children }) => <div>{children}</div>);

describe('AIChatDeepSeek Integration Test', () => {
  let postSpy;


  // Spy and mock axios.post before each test
  beforeEach(() => {
    postSpy = jest.spyOn(axios, 'post').mockImplementation((url, data, config) => {
      const lastMsg = data.messages[data.messages.length - 1].content;
      const content = lastMsg.includes('France') ? 'Paris' : 'Riyadh';
      return Promise.resolve({ data: { choices: [{ message: { content } }] } });
    });
  });

  // Restore axios mock after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sends user message and displays response', async () => {
    render(
      <MemoryRouter>
        <AIChatDeepSeek />
      </MemoryRouter>
    );

    const question = 'What is the capital of France? (Reply only with the name)';
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: question } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Wait for API call and assert it was called once
    await waitFor(() => expect(postSpy).toHaveBeenCalledTimes(1), { timeout: 10000 });

    // Verify UI update
    await waitFor(() => {
      expect(input).toHaveValue('');
      expect(screen.getByText(question)).toBeInTheDocument();
      expect(screen.getByText('Paris')).toBeInTheDocument();
    });
  });

  test('clears the input after submitting a message', async () => {
    render(
      <MemoryRouter>
        <AIChatDeepSeek />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: 'Any question' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Wait for API call to complete and input to clear
    await waitFor(() => expect(postSpy).toHaveBeenCalledTimes(1), { timeout: 10000 });
    await waitFor(() => expect(input).toHaveValue(''), { timeout: 10000 });
  });



  test('renders messages in correct positions', async () => {
    render(
      <MemoryRouter>
        <AIChatDeepSeek />
      </MemoryRouter>
    );

    const question = 'What is Saudi Arabia capital? (Reply only with the name)';
    const input = screen.getByPlaceholderText('Enter your Question ?');
    fireEvent.change(input, { target: { value: question } });
    fireEvent.keyDown(input, { key: 'Enter' });

    // Wait for API call and assert it was called once
    await waitFor(() => expect(postSpy).toHaveBeenCalledTimes(1), { timeout: 10000 });

    // Verify message content and positioning
    const userMsg = await screen.findByText(question, { timeout: 10000 });
    const aiMsg = await screen.findByText('Riyadh', { timeout: 10000 });

    expect(userMsg.closest('[class*="justify-end"]')).toBeInTheDocument();
    expect(aiMsg.closest('[class*="justify-start"]')).toBeInTheDocument();
  });
});
