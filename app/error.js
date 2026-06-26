'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  // Classify error type for a more helpful message
  const isNetworkError =
    error?.message?.toLowerCase().includes('fetch') ||
    error?.message?.toLowerCase().includes('network') ||
    error?.message?.toLowerCase().includes('failed to load');

  const isTwilioError =
    error?.message?.toLowerCase().includes('twilio') ||
    error?.message?.toLowerCase().includes('token') ||
    error?.message?.toLowerCase().includes('device');

  const getTitle = () => {
    if (isNetworkError) return 'Connection Lost';
    if (isTwilioError) return 'Voice Service Error';
    return 'Something Went Wrong';
  };

  const getMessage = () => {
    if (isNetworkError)
      return 'Unable to reach the server. Check your internet connection and try again.';
    if (isTwilioError)
      return 'The voice service failed to initialize. Check your Twilio credentials in settings.';
    return 'An unexpected error occurred. You can try reloading or go back to the home screen.';
  };

  const getIcon = () => {
    if (isNetworkError) return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
        <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0122.56 9" />
        <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
        <path d="M8.53 16.11a6 6 0 016.95 0" />
        <circle cx="12" cy="20" r="1" fill="currentColor" />
      </svg>
    );
    if (isTwilioError) return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    );
    return (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">

        {/* Error card */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-3xl p-8 text-center mb-4">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.2)] flex items-center justify-center text-red-400">
              {getIcon()}
            </div>
          </div>

          {/* Text */}
          <h1 className="text-xl font-bold text-white mb-2">{getTitle()}</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{getMessage()}</p>

          {/* Error detail (collapsed) */}
          {error?.message && (
            <details className="mb-6 text-left">
              <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-400 transition-colors select-none">
                Error details
              </summary>
              <div className="mt-2 bg-[#141414] border border-[#2a2a2a] rounded-xl p-3">
                <code className="text-xs text-red-400 break-all font-mono leading-relaxed">
                  {error.message}
                </code>
              </div>
            </details>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 bg-[#00ff88] text-black font-semibold rounded-xl py-3.5 text-sm transition-all hover:opacity-90 active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              Try Again
            </button>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 font-medium rounded-xl py-3 text-sm transition-all hover:bg-[#242424] active:scale-95"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go to Home
            </button>
          </div>
        </div>

        {/* Help tip */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3 flex items-start gap-3">
          <svg className="text-yellow-500 flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <p className="text-xs text-gray-600 leading-relaxed">
            {isTwilioError
              ? 'Go to Settings → Reconnect Voice Device, or check your Twilio credentials in .env.local'
              : 'If this keeps happening, check your network connection or contact support.'
            }
          </p>
        </div>

      </div>
    </div>
  );
}
