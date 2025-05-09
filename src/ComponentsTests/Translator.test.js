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
    // Arrange: mock a successful translation response
    AWS.Translate().translateText().promise.mockResolvedValue(mockSuccessResponse);

    render(
      <MemoryRouter>
        <Translator />
      </MemoryRouter>
    );

    // Act: select source language "English"
    fireEvent.click(screen.getAllByRole('combobox')[0]);
    fireEvent.click(await screen.findByText('English'));

    // Act: select target language "French"
    fireEvent.click(screen.getAllByRole('combobox')[1]);
    fireEvent.click(await screen.findByText('French'));

    // Act: type into the "FROM" textarea
    fireEvent.change(screen.getByLabelText('FROM'), {
      target: { value: 'Hello world' },
    });

    // Assert: AWS.Translate.translateText was called with correct params
    await waitFor(() => {
      expect(AWS.Translate().translateText).toHaveBeenCalledWith({
        Text: 'Hello world',
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'fr',
      });
    });

    // Assert: translated text appears in the "TO" textarea
    await waitFor(() => {
      expect(screen.getByLabelText('TO')).toHaveValue('Bonjour le monde');
    });
  });

  test('handles API error gracefully', async () => {
    // Arrange: mock a failed translation response
    AWS.Translate().translateText().promise.mockRejectedValue(mockErrorResponse);

    render(
      <MemoryRouter>
        <Translator />
      </MemoryRouter>
    );

    // Act: select languages
    fireEvent.click(screen.getAllByRole('combobox')[0]);
    fireEvent.click(await screen.findByText('English'));
    fireEvent.click(screen.getAllByRole('combobox')[1]);
    fireEvent.click(await screen.findByText('French'));

    // Act: type into the "FROM" textarea
    fireEvent.change(screen.getByLabelText('FROM'), {
      target: { value: 'Hello world' },
    });

    // Assert: on error, the "TO" textarea remains empty
    await waitFor(() => {
      expect(screen.getByLabelText('TO')).toHaveValue('');
    });
  });
});
