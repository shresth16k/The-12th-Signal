import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import SignalSubmit from './SignalSubmit';

describe('SignalSubmit Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('renders the report form elements', () => {
    render(<SignalSubmit />);

    expect(screen.getByText(/Report Stadium Issue \/ Ask Question/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Submit Signal/i });
    expect(submitButton).toBeInTheDocument();
    // Button should be disabled initially when input is empty
    expect(submitButton).toBeDisabled();
  });

  test('enables submit button when text is typed', () => {
    render(<SignalSubmit />);

    const textarea = screen.getByLabelText(/Description/i);
    const submitButton = screen.getByRole('button', { name: /Submit Signal/i });

    fireEvent.change(textarea, { target: { value: 'Water leak in section 212 washroom' } });
    expect(submitButton).not.toBeDisabled();
  });

  test('submits form and calls API endpoint with correct payload', async () => {
    // Mock the global fetch API
    const mockFetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'sig_mock123' }),
      })
    );
    vi.stubGlobal('fetch', mockFetch);

    render(<SignalSubmit />);

    const textarea = screen.getByLabelText(/Description/i);
    fireEvent.change(textarea, { target: { value: 'Water leak in section 212 washroom' } });

    const submitButton = screen.getByRole('button', { name: /Submit Signal/i });
    fireEvent.click(submitButton);

    // Verify it shows submitting state
    expect(screen.getByText(/Submitting\.\.\./i)).toBeInTheDocument();

    // Verify fetch was called correctly
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    const callArgs = mockFetch.mock.calls[0];
    const url = callArgs[0];
    const options = callArgs[1];

    expect(url).toContain('/api/signals');
    expect(options.method).toBe('POST');

    const parsedBody = JSON.parse(options.body);
    expect(parsedBody.source_type).toBe('app_tap');
    expect(parsedBody.location_zone).toBe('Section 212');
    expect(parsedBody.raw_text).toBe('Water leak in section 212 washroom');
    expect(parsedBody.sentiment_score).toBe(0.0);

    // Verify it updates UI to show submission success
    await waitFor(() => {
      expect(screen.getByText(/Signal Submitted/i)).toBeInTheDocument();
      expect(screen.getByText(/Thank you. Stadium operations has been notified./i)).toBeInTheDocument();
    });
  });
});
