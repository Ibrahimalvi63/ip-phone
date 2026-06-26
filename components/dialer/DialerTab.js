'use client';
import { useState, useEffect, useCallback } from 'react';
import { CALL_STATE } from '../../hooks/useTwilio';
import { getSettings, saveContact } from '../../lib/storage';
import { COUNTRY_CODES, formatDuration } from '../../lib/utils';
import ActiveCallOverlay from './ActiveCallOverlay';

const KEYS = [
  { digit: '1', sub: '' }, { digit: '2', sub: 'ABC' }, { digit: '3', sub: 'DEF' },
  { digit: '4', sub: 'GHI' }, { digit: '5', sub: 'JKL' }, { digit: '6', sub: 'MNO' },
  { digit: '7', sub: 'PQRS' }, { digit: '8', sub: 'TUV' }, { digit: '9', sub: 'WXYZ' },
  { digit: '*', sub: '' }, { digit: '0', sub: '+' }, { digit: '#', sub: '' },
];

export default function DialerTab({ twilio, onContact, prefillNumber, onPrefillConsumed }) {
  const { callState, callDuration, currentNumber, makeCall, hangUp, sendDTMF,
    toggleMute, toggleSpeaker, isMuted, isSpeaker } = twilio;

  const settings = getSettings();
  const [countryCode, setCountryCode] = useState(settings.countryCode || '+880');
  const [number, setNumber] = useState('');
  const [showCCPicker, setShowCCPicker] = useState(false);
  // console.log(showCCPicker)

  const isIdle = callState === CALL_STATE.IDLE || callState === CALL_STATE.ENDED || callState === CALL_STATE.ERROR;
  const isConnecting = callState === CALL_STATE.CONNECTING || callState === CALL_STATE.RINGING;
  const isInCall = callState === CALL_STATE.IN_CALL;

  useEffect(() => {
    if (!prefillNumber) return;

    const cc = COUNTRY_CODES
      .sort((a, b) => b.code.length - a.code.length)
      .find(c => prefillNumber.startsWith(c.code));

    if (cc) {
      setCountryCode(cc.code);
      setNumber(prefillNumber.slice(cc.code.length));
    } else {
      setNumber(prefillNumber);
    }

    onPrefillConsumed?.();
  }, [prefillNumber, onPrefillConsumed]);

  const handleKey = useCallback((digit) => {
    if (isInCall) { sendDTMF(digit); return; }
    setNumber(n => (n + digit).slice(0, 20));
  }, [isInCall, sendDTMF]);

  const handleBackspace = () => {
    if (!isIdle) return;
    setNumber(n => n.slice(0, -1));
  };

  const handleCall = () => {
    if (!number) return;
    const full = `${countryCode}${number}`;
    makeCall(full);
  };

  if (isInCall || isConnecting) {
    return (
      <ActiveCallOverlay
        callState={callState}
        number={currentNumber}
        duration={callDuration}
        isMuted={isMuted}
        isSpeaker={isSpeaker}
        onHangUp={hangUp}
        onToggleMute={toggleMute}
        onToggleSpeaker={toggleSpeaker}
        onSendDTMF={sendDTMF}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">

      <div className="px-4 pt-4 pb-3 mb-10">
        <h1 className="text-xl font-bold mb-3">Dialer</h1>

        {/* Call status if ended/error */}
        {(callState === CALL_STATE.ENDED || callState === CALL_STATE.ERROR) && (
          <div className="mx-6 mb-3">
            <div className={`text-center py-2 rounded-xl text-sm font-medium ${callState === CALL_STATE.ENDED
              ? 'bg-[rgba(0,255,136,0.08)] text-[#00ff88]'
              : 'bg-[rgba(255,68,68,0.08)] text-red-400'
              }`}>
              {callState === CALL_STATE.ENDED ? 'Call ended' : 'Call failed'}
            </div>
          </div>
        )}
      </div>

      {/* Number display */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2">
          {/* Country code picker */}
          <div className="relative">
            <button
              onClick={() => setShowCCPicker(v => !v)}
              className="flex items-center gap-1.5 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-3 py-3 text-sm font-medium text-white hover:border-[#3a3a3a] transition-colors"
            >
              <span>{COUNTRY_CODES.find(c => c.code === countryCode)?.flag || '🌍'}</span>
              <span>{countryCode}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>

            {showCCPicker && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl shadow-xl overflow-hidden min-w-[200px] max-h-72 overflow-y-auto">
                {COUNTRY_CODES.map(cc => (
                  <button
                    key={cc.code}
                    onClick={() => { setCountryCode(cc.code); setShowCCPicker(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#2a2a2a] transition-colors ${countryCode === cc.code ? 'text-[#00ff88]' : 'text-white'
                      }`}
                  >
                    <span className="text-base">{cc.flag}</span>
                    <span className="flex-1 text-left">{cc.name}</span>
                    <span className="text-gray-500">{cc.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Number input */}
          <div className="flex-1 relative">
            <input
              type="tel"
              value={number}
              onChange={e => setNumber(e.target.value.replace(/[^0-9*#]/g, '').slice(0, 20))}
              placeholder="Phone number"
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xl font-semibold text-white outline-none focus:border-[#00ff88] tracking-wider placeholder:text-gray-700 placeholder:text-base placeholder:font-normal"
            />
            {number && (
              <button
                onClick={handleBackspace}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1 active:scale-90"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
                  <line x1="18" y1="9" x2="13" y2="14" /><line x1="13" y1="9" x2="18" y2="14" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Keypad */}
      <div className="flex-1 px-6 pb-4">
        <div className="grid grid-cols-3 gap-3 mb-5">
          {KEYS.map(({ digit, sub }) => (
            <button
              key={digit}
              onPointerDown={() => handleKey(digit)}
              className="key-btn h-[72px] select-none"
            >
              <span className="text-2xl font-semibold leading-none">{digit}</span>
              {sub && <span className="text-[9px] text-gray-500 font-medium tracking-widest mt-0.5">{sub}</span>}
            </button>
          ))}
        </div>

        {/* Call / Hangup button */}
        <div className="flex items-center justify-center gap-6">
          {/* Spacer */}
          <div className="w-14" />

          <button
            onClick={handleCall}
            disabled={!number}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-150 active:scale-95 disabled:opacity-30 ${number ? 'bg-[#00ff88] glow-green' : 'bg-[#1e1e1e] border border-[#2a2a2a]'
              }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={number ? 'black' : '#555'}>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
          </button>

          {/* Contacts quick-add */}
          {number && (
            <button onClick={() => onContact(`${countryCode}${number}`)} className="w-14 h-14 rounded-full bg-[#1e1e1e] border border-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors active:scale-95">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                <line x1="12" y1="14" x2="12" y2="20" /><line x1="9" y1="17" x2="15" y2="17" />
              </svg>
            </button>
          )}
          {!number && <div className="w-14" />}

        </div>
      </div>
    </div>
  );
}
