'use client';

export default function DeviceStatusBar({ deviceReady, deviceError, onRetry }) {
  if (deviceReady) return null;

  return (
    <div className={`flex items-center justify-between px-4 py-2 text-xs font-medium ${
      deviceError
        ? 'bg-[rgba(255,68,68,0.1)] border-b border-[rgba(255,68,68,0.2)] text-red-400'
        : 'bg-[rgba(255,204,0,0.08)] border-b border-[rgba(255,204,0,0.2)] text-yellow-400'
    }`}>
      <div className="flex items-center gap-2">
        {deviceError ? (
          <>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
            {deviceError}
          </>
        ) : (
          <>
            <span className="w-2.5 h-2.5 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin-slow" />
            Connecting to voice service…
          </>
        )}
      </div>
      {deviceError && (
        <button onClick={onRetry} className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2">
          Retry
        </button>
      )}
    </div>
  );
}
