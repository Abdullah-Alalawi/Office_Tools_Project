import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import GrammarChecker from '../Pages/GrammarCorrection';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');

// Mock ProseMirror with a simpler implementation
jest.mock('prosemirror-view', () => {
  return {
    EditorView: jest.fn().mockImplementation(() => ({
      state: {
        doc: {
          textContent: '',
          eq: jest.fn().mockReturnValue(false),
          descendants: jest.fn()
        },
        tr: {
          removeMark: jest.fn(),
          addMark: jest.fn(),
          replaceWith: jest.fn(),
          doc: {
            textContent: ''
          }
        },
        schema: {
          marks: {
            error: { 
              create: jest.fn(),
              type: {}
            },
            highlight: { 
              create: jest.fn(),
              type: {}
            }
          },
          text: jest.fn().mockImplementation(text => ({ text }))
        }
      },
      dispatch: jest.fn(),
      destroy: jest.fn(),
      dom: {}, // Simplified DOM representation
      update: jest.fn()
    }))
  };
});

describe('GrammarChecker Component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: {
        matches: [
          {
            message: "Possible spelling mistake found",
            offset: 5,
            length: 4,
            replacements: [{ value: "tast " }],
            rule: { category: { id: "SPELLING" } }
          },
          {
            message: "This sentence does not start with an uppercase letter",
            offset: 0,
            length: 7,
            replacements: [{ value: "testing " }],
            rule: { category: { id: "CASING" } }
          }
        ]
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders the component with initial state', () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    expect(screen.getByTestId('grammar-editor')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Grammar & Spell Checker' })).toBeInTheDocument();
    expect(screen.getByText('Suggestions (0)')).toBeInTheDocument();
    expect(screen.getByText('No issues found. Start typing to analyze')).toBeInTheDocument();
  });

  test('triggers API call when text is long enough', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    // Get the mock EditorView instance
    const mockEditorView = require('prosemirror-view').EditorView.mock.results[0].value;
    mockEditorView.state.doc.textContent = 'testing ';
    mockEditorView.state.tr.doc.textContent = 'testing ';

    // Simulate editor update
    const updateFn = mockEditorView.update;
    if (updateFn) {
      act(() => {
        updateFn({ state: mockEditorView.state });
      });
    }

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  test('displays suggestions when API returns errors', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    // Get the mock EditorView instance
    const mockEditorView = require('prosemirror-view').EditorView.mock.results[0].value;
    mockEditorView.state.doc.textContent = 'angy ';
    mockEditorView.state.tr.doc.textContent = 'angy ';

    // Simulate editor update
    const updateFn = mockEditorView.update;
    if (updateFn) {
      act(() => {
        updateFn({ state: mockEditorView.state });
      });
    }

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText(/Suggestions \(\d+\)/)).toBeInTheDocument();
      expect(screen.getByText('Possible spelling mistake found')).toBeInTheDocument();
      expect(screen.getByText('Capitalization')).toBeInTheDocument();
    });
  });

  test('does not call API for short text', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    // Get the mock EditorView instance
    const mockEditorView = require('prosemirror-view').EditorView.mock.results[0].value;
    mockEditorView.state.doc.textContent = 'hi';
    mockEditorView.state.tr.doc.textContent = 'hi';

    // Simulate editor update
    const updateFn = mockEditorView.update;
    if (updateFn) {
      act(() => {
        updateFn({ state: mockEditorView.state });
      });
    }

    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(axios.post).not.toHaveBeenCalled();
    expect(screen.getByText('No issues found. Start typing to analyze')).toBeInTheDocument();
  });
});