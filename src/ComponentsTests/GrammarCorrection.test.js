// src/ComponentsTests/GrammarCorrection.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import GrammarChecker from '../Pages/GrammarCorrection';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';


// Mock external dependencies
jest.mock('axios');
jest.mock('prosemirror-view');
jest.mock('prosemirror-state');
jest.mock('prosemirror-model', () => {
  const actual = jest.requireActual('prosemirror-model');
  return {
    __esModule: true,
    Schema: actual.Schema,
    DOMParser: actual.DOMParser,
  };
});
jest.mock('prosemirror-schema-basic', () => {
  const { schema } = jest.requireActual('prosemirror-schema-basic');
  return { __esModule: true, schema, default: schema };
});
jest.mock('prosemirror-commands');
jest.mock('prosemirror-keymap');
jest.mock('prosemirror-history');

describe('GrammarChecker Component', () => {
  beforeEach(() => {
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
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    expect(screen.getByText('Grammar & Spell Checker')).toBeInTheDocument();
    expect(screen.getByText('Suggestions (0)')).toBeInTheDocument();
    expect(screen.getByText('No issues found. Start typing to analyze')).toBeInTheDocument();
  });

  test('displays loading state when checking text', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    const editor = screen.getByTestId('grammar-editor');
    // simulate typing into the contentEditable
    fireEvent.input(editor, { target: { textContent: 'testing' } });

    // as soon as runCheck() fires, isLoading should be true
    expect(screen.getByText('Checking text...')).toBeInTheDocument();

    // and eventually the API call resolves
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  test('sends the correct prose-mirror text to the API', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    const editor = screen.getByTestId('grammar-editor');
    fireEvent.input(editor, { target: { textContent: 'Hello, world!' } });

    await waitFor(() => {
      // ensure the API was called
      expect(axios.post).toHaveBeenCalledTimes(1);

      // grab the payload from the first call: axios.post(url, { text, language }, ...)
      const [, payload] = axios.post.mock.calls[0];
      expect(payload.text).toBe('Hello, world!');
      expect(payload.language).toBe('en-US');
    });
  });

  test('displays errors when API returns them', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    const editor = screen.getByTestId('grammar-editor');
    fireEvent.input(editor, { target: { textContent: 'he' } });

    // wait for suggestions to render
    await waitFor(() => {
      expect(screen.getByText('Suggestions (1)')).toBeInTheDocument();
    });

    expect(screen.getByText('This sentence does not start with an uppercase letter.')).toBeInTheDocument();
    expect(screen.getByText('Typos')).toBeInTheDocument();
  });

  test('applies correction when suggestion is clicked', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    const editor = screen.getByTestId('grammar-editor');
    fireEvent.input(editor, { target: { textContent: 'testing' } });

    // wait for suggestion to appear
    await waitFor(() => {
      expect(screen.getByText(/test/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('test'));

    // clicking a suggestion should re-trigger the API
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });

  test('does not call API for short text', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    const editor = screen.getByTestId('grammar-editor');
    fireEvent.input(editor, { target: { textContent: 'hi' } });

    // debounce is 1.5s, so wait a bit longer
    await new Promise(res => setTimeout(res, 1600));

    expect(screen.getByText('No issues found. Start typing to analyze')).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('displays errors when API returns them', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );
  
    const editor = screen.getByTestId('grammar-editor');
    const view = editor.__pmView;
    act(() => {
      view.dispatch(view.state.tr.insertText('testing'));
    });
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(screen.getByText('Suggestions (1)')).toBeInTheDocument();
    });
  });

  test('highlights error on hover', async () => {
    render(
      <MemoryRouter>
        <GrammarChecker />
      </MemoryRouter>
    );

    const editor = screen.getByTestId('grammar-editor');
    fireEvent.input(editor, { target: { textContent: 'he are angy' } });

    // wait for the suggestion text to show
    await waitFor(() => {
      expect(screen.getByText("This sentence does not start with an uppercase letter.")).toBeInTheDocument();
    }, { timeout: 2000 });



    // TODO: assert your highlight DOM change here
  });
});
