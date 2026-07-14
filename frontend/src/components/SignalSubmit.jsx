import React, { useState } from 'react';

/**
 * SignalSubmit component for the fan to report issues or ask questions.
 * Connects to the backend POST /api/signals API to submit user reports.
 */
export default function SignalSubmit() {
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSubmitting(true);
    try {
      const host = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8000' 
        : '';
      const response = await fetch(`${host}/api/signals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_type: 'app_tap',
          location_zone: 'Section 212',
          raw_text: inputText,
          sentiment_score: 0.0
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setInputText('');
        // Reset confirmation state after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else {
        console.error("Failed to submit signal:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting signal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="p-4 w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <svg className="w-10 h-10 text-green-500 mb-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-base font-bold text-white mb-1">Signal Submitted</h3>
          <p className="text-xs text-slate-400">Thank you. Stadium operations has been notified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-lg text-slate-100">
      <h3 className="text-base font-bold mb-3 text-white">Report Stadium Issue / Ask Question</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label htmlFor="signal-input" className="block text-xs font-semibold text-slate-400 mb-1">
            Description
          </label>
          <textarea
            id="signal-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your issue or question here (e.g. Cleanliness issue at restroom Sec 212)..."
            className="w-full p-2 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            rows={4}
            required
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !inputText.trim()}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Signal'}
        </button>
      </form>
    </div>
  );
}
