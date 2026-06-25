'use client';
import { useState } from 'react';
import { CALL_STATE } from '../../hooks/useTwilio';
import { formatDuration, getInitials, avatarColor } from '../../lib/utils';
import { findContactByNumber } from '../../lib/storage';

const DTMF_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

export default function ActiveCallOverlay({
  callState, number, duration, isMuted, isSpeaker,
  onHangUp, onToggleMute, onToggleSpeaker, onSendDTMF
}) {
  const [showDTMF, setShowDTMF] = useState(false);
  const contact = number ? findContactByNumber(number) : null;
  const name = contact?.name || number || 'Unknown';
  const initials = getInitials(name);
  const color = avatarColor(name);
  const isConnecting = callState === CALL_STATE.CONNECTING || callState === CALL_STATE.RINGING;

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f]">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
        {/* Avatar with pulse */}
        <div className="relative mb-6">
          {isConnecting && (
            <>
              <div className={`absolute inset-0 rounded-full ${color} opacity-20 animate-pulse-ring scale-125`} />
              <div className={`absolute inset-0 rounded-full ${color} opacity-10 animate-pulse-ring scale-150 animation-delay-300`} />
            </>
          )}
          <div className={`w-24 h-24 rounded-full ${color} flex items-center justify-center text-white text-3xl font-bold relative z-10`}>
            {initials}
          </div>
          {!isConnecting && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0f0f0f] rounded-full flex items-center justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-[#00ff88] animate-pulse" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-white mb-1 truncate max-w-full">{name}</h2>
        {contact && <p className="text-sm text-gray-500 mb-3">{number}</p>}

        {/* Status / Timer */}
        <div className={`status-pill ${isConnecting
          ? 'bg-[rgba(255,204,0,0.1)] text-yellow-400 border border-[rgba(255,204,0,0.25)] animate-blink'
          : 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[rgba(0,255,136,0.2)]'
          }`}>
          {isConnecting ? (callState === CALL_STATE.RINGING ? '⚡ Ringing…' : '⏳ Connecting…') : formatDuration(duration)}
        </div>
      </div>

      {/* DTMF Pad (expandable) */}
      {showDTMF && (
        <div className="px-6 pb-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-2">
              {DTMF_KEYS.map(k => (
                <button
                  key={k}
                  onPointerDown={() => onSendDTMF(k)}
                  className="h-12 rounded-xl bg-[#242424] border border-[#2a2a2a] text-white font-semibold text-lg active:scale-95 active:bg-[#2a2a2a] transition-all"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-6 pb-8">
        {/* Top row */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <CallBtn
            active={isMuted}
            activeColor="bg-[rgba(255,204,0,0.15)] border-yellow-500/30 text-yellow-400"
            inactiveColor="bg-[#1e1e1e] border-[#2a2a2a] text-gray-400"
            onClick={onToggleMute}
            icon={isMuted ? <MicOffIcon /> : <MicIcon />}
            label={isMuted ? 'Unmute' : 'Mute'}
          />
          <CallBtn
            active={showDTMF}
            activeColor="bg-[rgba(68,136,255,0.15)] border-blue-500/30 text-blue-400"
            inactiveColor="bg-[#1e1e1e] border-[#2a2a2a] text-gray-400"
            onClick={() => setShowDTMF(v => !v)}
            icon={<KeypadIcon />}
            label="Keypad"
          />
          <CallBtn
            active={isSpeaker}
            activeColor="bg-[rgba(0,255,136,0.15)] border-green-500/30 text-[#00ff88]"
            inactiveColor="bg-[#1e1e1e] border-[#2a2a2a] text-gray-400"
            onClick={onToggleSpeaker}
            icon={<SpeakerIcon />}
            label={isSpeaker ? 'Speaker' : 'Speaker'}
          />
        </div>

        {/* Hang up */}
        <div className="flex justify-center">
          <button
            onClick={onHangUp}
            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-xl active:scale-90 transition-all glow-red"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function CallBtn({ active, activeColor, inactiveColor, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 py-3 rounded-2xl border transition-all active:scale-95 ${active ? activeColor : inactiveColor
        }`}
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}

function MicIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>; }
function MicOffIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" /><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>; }
function KeypadIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="9.5" y="3" width="5" height="5" rx="1" /><rect x="16" y="3" width="5" height="5" rx="1" /><rect x="3" y="9.5" width="5" height="5" rx="1" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><rect x="16" y="9.5" width="5" height="5" rx="1" /><rect x="3" y="16" width="5" height="5" rx="1" /><rect x="9.5" y="16" width="5" height="5" rx="1" /><rect x="16" y="16" width="5" height="5" rx="1" /></svg>; }
function SpeakerIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 010 7.07" /><path d="M19.07 4.93a10 10 0 010 14.14" /></svg>; }
