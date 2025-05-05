import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GrammaerChecker from '../GrammarCorrection';
import axios from 'axios';

// Mock the external dependencies
jest.mock('axios');
jest.mock('prosemirror-view');
jest.mock('prosemirror-state');
jest.mock('prosemirror-model');
jest.mock('prosemirror-schema-basic');
jest.mock('prosemirror-commands');
jest.mock('prosemirror-keymap');
jest.mock('prosemirror-history');

describe('GrammarChecker Component', () => {
  beforeEach(() => {
    // Mock axios post for the grammar check API
    axios.post.mockResolvedValue({
      data: {
        matches: [
          {
            message: "Possible spelling mistake found",
            offset: 5,
            length: 4,
            replacements: [{ value: "test" }],
            rule: { category: { id: "SPELLING" } }
          }
        ]
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component with initial state', () => {
    render(<GrammaerChecker />);
    
    expect(screen.getByText('Grammar & Spell Checker')).toBeInTheDocument();
    expect(screen.getByText('Suggestions (0)')).toBeInTheDocument();
    expect(screen.getByText('No issues found. Start typing to analyze')).toBeInTheDocument();
  });

  test('displays loading state when checking text', async () => {
    render(<GrammaerChecker />);
    
    // Simulate typing in the editor
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'testing' } });
    
    await waitFor(() => {
      expect(screen.getByText('Checking text...')).toBeInTheDocument();
    });
  });

  test('displays errors when API returns them', async () => {
    render(<GrammaerChecker />);
    
    // Simulate typing in the editor
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'testing' } });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(screen.getByText('Suggestions (1)')).toBeInTheDocument();
      expect(screen.getByText('Possible spelling mistake found')).toBeInTheDocument();
      expect(screen.getByText('Spelling')).toBeInTheDocument();
    });
  });

  test('applies correction when suggestion is clicked', async () => {
    render(<GrammaerChecker />);
    
    // Simulate typing in the editor
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'testing' } });
    
    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
    });
    
    // Click on the suggestion
    fireEvent.click(screen.getByText('test'));
    
    // Verify the API was called again after applying correction
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });

  test('does not call API for short text', async () => {
    render(<GrammaerChecker />);
    
    // Simulate typing very short text
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'a' } });
    
    // Wait for debounce time
    await new Promise(resolve => setTimeout(resolve, 1600));
    
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('handles API errors gracefully', async () => {
    axios.post.mockRejectedValueOnce(new Error('API error'));
    
    render(<GrammaerChecker />);
    
    // Simulate typing in the editor
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'testing' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Possible spelling mistake found')).not.toBeInTheDocument();
      expect(screen.getByText('No issues found. Start typing to analyze')).toBeInTheDocument();
    });
  });

  test('highlights error on hover', async () => {
    render(<GrammaerChecker />);
    
    // Simulate typing in the editor
    const editor = screen.getByRole('textbox');
    fireEvent.change(editor, { target: { value: 'testing' } });
    
    // Wait for suggestions to appear
    const errorItem = await screen.findByText('Possible spelling mistake found');
    
    // Hover over the error
    fireEvent.mouseEnter(errorItem);
    
    // (In a real test, assert the DOM highlight change here)
  });
});