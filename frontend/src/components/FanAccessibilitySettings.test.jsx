import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import FanAccessibilitySettings from './FanAccessibilitySettings';

describe('FanAccessibilitySettings Component', () => {
  test('renders the title and all three accessibility options', () => {
    render(<FanAccessibilitySettings />);
    
    // Assert title and description are present
    expect(screen.getByText(/Accessibility Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Customize your matchday viewing preferences/i)).toBeInTheDocument();
    
    // Assert toggles are present
    expect(screen.getByText('Sign Language PIP')).toBeInTheDocument();
    expect(screen.getByText('Audio Description')).toBeInTheDocument();
    expect(screen.getByText('Larger Display Text')).toBeInTheDocument();
  });

  test('toggles the buttons and changes visual state when clicked', () => {
    render(<FanAccessibilitySettings />);
    
    const signLanguageToggle = screen.getByRole('button', { name: /Toggle Sign Language PIP/i });
    const audioDescriptionToggle = screen.getByRole('button', { name: /Toggle Audio Description/i });
    const largerTextToggle = screen.getByRole('button', { name: /Toggle Larger Display Text/i });
    
    // Initial state check - default should be false (bg-slate-800 class)
    expect(signLanguageToggle).toHaveClass('bg-slate-800');
    expect(audioDescriptionToggle).toHaveClass('bg-slate-800');
    expect(largerTextToggle).toHaveClass('bg-slate-800');
    
    // Click Sign Language PIP toggle
    fireEvent.click(signLanguageToggle);
    expect(signLanguageToggle).toHaveClass('bg-accent-purple');
    expect(signLanguageToggle).not.toHaveClass('bg-slate-800');
    
    // Click Sign Language PIP again to toggle off
    fireEvent.click(signLanguageToggle);
    expect(signLanguageToggle).toHaveClass('bg-slate-800');
    
    // Click Audio Description toggle
    fireEvent.click(audioDescriptionToggle);
    expect(audioDescriptionToggle).toHaveClass('bg-accent-purple');
    
    // Click Larger Display Text toggle
    fireEvent.click(largerTextToggle);
    expect(largerTextToggle).toHaveClass('bg-accent-purple');
  });
});
