import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Translator from '../Pages/Translator';
import AWS from 'aws-sdk';
import { MemoryRouter } from 'react-router-dom';

// Mock AWS Translate
jest.mock('aws-sdk', () => {
  const mockTranslate = {
    translateText: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };
  return {
    config: { update: jest.fn() },
    Translate: jest.fn(() => mockTranslate),
  };
});

describe('Translator API Response', () => {
  const mockSuccessResponse = { TranslatedText: 'Bonjour le monde' };
  const mockErrorResponse = new Error('Translation failed');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays translated text when API call succeeds', async () => {
    AWS.Translate().translateText().promise.mockResolvedValue(mockSuccessResponse);

    render(
      <MemoryRouter>
        <Translator />
      </MemoryRouter>
    );

    const [fromSelectBtn, toSelectBtn] = screen.getAllByRole('button', {
      name: /Select Language/,
    });

    fireEvent.click(fromSelectBtn);
    fireEvent.click(await screen.findByRole('option', { name: 'English' }));
    fireEvent.click(toSelectBtn);
    fireEvent.click(await screen.findByRole('option', { name: 'French' }));

    fireEvent.change(screen.getByLabelText('FROM'), {
      target: { value: 'Hello world' },
    });

    await waitFor(() => {
      expect(AWS.Translate().translateText).toHaveBeenCalledWith({
        Text: 'Hello world',
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'fr',
      });
    });

    await waitFor(() => {
      expect(screen.getByLabelText('TO')).toHaveValue('Bonjour le monde');
    });
  });

  test('handles API error gracefully', async () => {
    AWS.Translate().translateText().promise.mockRejectedValue(mockErrorResponse);

    render(
      <MemoryRouter>
        <Translator />
      </MemoryRouter>
    );

    const [fromSelectBtn, toSelectBtn] = screen.getAllByRole('button', {
      name: /Select Language/,
    });

    fireEvent.click(fromSelectBtn);
    fireEvent.click(await screen.findByRole('option', { name: 'English' }));
    fireEvent.click(toSelectBtn);
    fireEvent.click(await screen.findByRole('option', { name: 'French' }));

    fireEvent.change(screen.getByLabelText('FROM'), {
      target: { value: 'Hello world' },
    });

    await waitFor(() => expect(AWS.Translate().translateText).toHaveBeenCalled());

    // On error the TO textarea stays empty
    await waitFor(() => {
      expect(screen.getByLabelText('TO')).toHaveValue('');
    });
  });
}); 
