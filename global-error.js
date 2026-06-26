'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0f0f0f', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: '24px',
        }}>
          <div style={{
            width: '100%', maxWidth: '360px', background: '#1e1e1e',
            border: '1px solid #2a2a2a', borderRadius: '24px',
            padding: '40px 32px', textAlign: 'center',
          }}>
            {/* Icon */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="1.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              Critical Error
            </h1>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
              The application failed to load. This is usually a configuration or network issue.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={reset}
                style={{
                  background: '#00ff88', color: '#000', border: 'none',
                  borderRadius: '12px', padding: '14px', fontSize: '14px',
                  fontWeight: 600, cursor: 'pointer', width: '100%',
                }}
              >
                Reload App
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'transparent', color: '#666',
                  border: '1px solid #2a2a2a', borderRadius: '12px',
                  padding: '12px', fontSize: '14px', cursor: 'pointer', width: '100%',
                }}
              >
                Force Refresh
              </button>
            </div>

            {error?.message && (
              <p style={{
                marginTop: '20px', fontSize: '11px', color: '#444',
                fontFamily: 'monospace', wordBreak: 'break-all',
              }}>
                {error.message}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
