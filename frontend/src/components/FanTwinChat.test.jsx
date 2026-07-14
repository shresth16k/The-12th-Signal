import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import FanTwinChat from './FanTwinChat';

describe('FanTwinChat Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    
    // Mock scrollIntoView which is not implemented in JSDOM
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  test('renders chat header and default greeting messages', () => {
    render(<FanTwinChat />);
    
    // Assert Header elements
    expect(screen.getByText('AI MATCHDAY TWIN')).toBeInTheDocument();
    expect(screen.getByText(/Personal Companion/i)).toBeInTheDocument();
    expect(screen.getByText(/Syncing/i)).toBeInTheDocument();
    
    // Assert default assistant messages are loaded
    expect(screen.getByText(/Hi Arjun!/i)).toBeInTheDocument();
    expect(screen.getByText(/I can help you check restroom lines/i)).toBeInTheDocument();
    expect(screen.getByText(/Grab dinner at Stand C/i)).toBeInTheDocument();
  });

  test('clicking a quick-suggestion chip populates the input field', () => {
    render(<FanTwinChat />);
    
    const input = screen.getByPlaceholderText(/Ask your Match Day Twin\.\.\./i);
    expect(input.value).toBe('');
    
    const foodChip = screen.getByRole('button', { name: /Shortest food line\?/i });
    fireEvent.click(foodChip);
    
    expect(input.value).toBe('🍔 Shortest food line?');
  });

  test('submitting a message adds it to chat, calls day-plan API, and replaces loading status with response', async () => {
    const mockPlanResponse = { plan: "Recommended plan: Eat at stand C in 10 mins. Use Gate 3 exit." };
    const mockFetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPlanResponse),
      })
    );
    vi.stubGlobal('fetch', mockFetch);

    render(<FanTwinChat />);
    
    const input = screen.getByPlaceholderText(/Ask your Match Day Twin\.\.\./i);
    const sendButton = screen.getByRole('button', { name: /Send message/i });
    
    // Type user query and click send
    fireEvent.change(input, { target: { value: 'Where should I go now?' } });
    fireEvent.click(sendButton);
    
    // 1. Verify user message is added to chat window
    expect(screen.getByText('Where should I go now?')).toBeInTheDocument();
    
    // 2. Verify temporary thinking bubble is displayed
    expect(screen.getByText(/Analyzing live crowd signals and generating day plan\.\.\./i)).toBeInTheDocument();
    
    // 3. Verify API fetch was called correctly
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
    
    const callArgs = mockFetch.mock.calls[0];
    const url = callArgs[0];
    const options = callArgs[1];
    
    expect(url).toContain('/api/day-plan');
    expect(options.method).toBe('POST');
    
    const profilePayload = JSON.parse(options.body);
    expect(profilePayload.id).toBe('fan_12');
    expect(profilePayload.seat_zone).toBe('Section 212');
    expect(profilePayload.language).toBe('English');

    // 4. Verify thinking bubble is replaced with the final plan response text
    await waitFor(() => {
      expect(screen.queryByText(/Analyzing live crowd signals/i)).not.toBeInTheDocument();
      expect(screen.getByText(mockPlanResponse.plan)).toBeInTheDocument();
    });
  });

  test('renders error message in chat if the day-plan API fails', async () => {
    const mockFetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        statusText: "Internal Server Error"
      })
    );
    vi.stubGlobal('fetch', mockFetch);

    render(<FanTwinChat />);
    
    const input = screen.getByPlaceholderText(/Ask your Match Day Twin\.\.\./i);
    const sendButton = screen.getByRole('button', { name: /Send message/i });
    
    fireEvent.change(input, { target: { value: 'Is it safe?' } });
    fireEvent.click(sendButton);
    
    // Wait for failure handling to substitute error text
    await waitFor(() => {
      expect(screen.queryByText(/Analyzing live crowd signals/i)).not.toBeInTheDocument();
      expect(screen.getByText(/I'm sorry, I'm unable to connect to stadium services/i)).toBeInTheDocument();
    });
  });
});
