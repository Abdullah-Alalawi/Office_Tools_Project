import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import GrammarChecker from '../Pages/GrammarCorrection';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

jest.mock('prosemirror-view', () => {
  let mockState = {
    doc: {
      textContent: '',
      eq: jest.fn().mockReturnValue(false),
      descendants: jest.fn(fn => {
        if (mockState.doc.textContent) fn({ text: mockState.doc.textContent }, 0);
      }),
    },
    tr: {
      removeMark: jest.fn(),
      addMark: jest.fn(),
      replaceWith: jest.fn(),
      doc: { textContent: '' },
    },
    schema: {
      marks: {
        error: { create: jest.fn(), type: {} },
        highlight: { create: jest.fn(), type: {} },
      },
      text: jest.fn(str => ({ text: str })),
    },
  };

  return {
    EditorView: jest.fn().mockImplementation(options => {
      if (options?.state) mockState = options.state;
      return {
        state: mockState,
        dispatch: jest.fn(),
        destroy: jest.fn(),
        dom: {
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          contains: jest.fn(),
          appendChild: jest.fn(),
          removeChild: jest.fn(),
        },
        update: jest.fn(update => {
          if (update?.state?.doc) {
            mockState.doc.textContent = update.state.doc.textContent;
            if (options?.state) options.state.doc.textContent = update.state.doc.textContent;
          }
        }),
      };
    }),
  };
});

describe('GrammarChecker Component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders initial state correctly', () => {
    render(<MemoryRouter><GrammarChecker /></MemoryRouter>);
    expect(screen.getByTestId('grammar-editor')).toBeInTheDocument();
    expect(screen.getByText('Suggestions (0)')).toBeInTheDocument();
  });

  test('does not call API for short text', async () => {
    render(<MemoryRouter><GrammarChecker /></MemoryRouter>);
    const mockView = require('prosemirror-view').EditorView.mock.results[0].value;

    await act(async () => {
      mockView.state.doc.textContent = 'hi';
      mockView.update({ state: { ...mockView.state, doc: { textContent: 'hi' } }});
      jest.advanceTimersByTime(1500);
    });

    expect(axios.post).not.toHaveBeenCalled();
  });



  test('handles API errors gracefully', async () => {
    axios.post.mockRejectedValue(new Error('API error'));

    render(<MemoryRouter><GrammarChecker /></MemoryRouter>);
    const mockView = require('prosemirror-view').EditorView.mock.results[0].value;

    await act(async () => {
      mockView.state.doc.textContent = 'He is angy ';
      mockView.update({
        state: {
          ...mockView.state,
          doc: { 
            textContent: 'He is angy ',
            descendants: fn => fn({ text: 'He is angy ' }, 0)
          }
        }
      });
      jest.advanceTimersByTime(1500);
    });

    await act(async () => {
      await Promise.resolve();
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Suggestions (0)')).toBeInTheDocument();
    });
  });
});
