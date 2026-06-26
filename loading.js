export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-8">

      {/* Logo + pulse rings */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <div
          className="absolute w-24 h-24 rounded-full bg-[rgba(0,255,136,0.08)] border border-[rgba(0,255,136,0.15)]"
          style={{ animation: 'ping-slow 2s ease-out infinite' }}
        />
        {/* Middle pulse ring */}
        <div
          className="absolute w-16 h-16 rounded-full bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)]"
          style={{ animation: 'ping-slow 2s ease-out infinite 0.4s' }}
        />
        {/* Logo circle */}
        <div className="relative w-14 h-14 rounded-full bg-[#1e1e1e] border border-[rgba(0,255,136,0.3)] flex items-center justify-center z-10 shadow-[0_0_24px_rgba(0,255,136,0.2)]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
              fill="#00ff88"
            />
          </svg>
        </div>
      </div>

      {/* App name */}
      <div className="flex flex-col items-center gap-1.5">
        <h1 className="text-xl font-bold text-white tracking-wide">IP Phone</h1>
        <p className="text-sm text-gray-600">Loading…</p>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
            style={{
              animation: `bounce-dot 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes ping-slow {
          0%   { transform: scale(0.85); opacity: 1; }
          100% { transform: scale(1.4);  opacity: 0; }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0);    opacity: 0.3; }
          40%            { transform: translateY(-6px); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
