'use client';
import { useEffect, useState } from 'react';
import { findContactByNumber, getContacts } from '../../lib/storage';
import { getInitials, avatarColor } from '../../lib/utils';

export default function IncomingCallModal({ call, onAccept, onReject }) {
  const from = call?.parameters?.From || 'Unknown';
  const contact = findContactByNumber(from);
  const name = contact?.name || from;
  const initials = getInitials(name);
  const color = avatarColor(name);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-[#1e1e1e] border border-[#2a2a2a] rounded-3xl p-6 animate-slide-up">

        {/* Pulse rings */}
        <div className="flex justify-center mb-6 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-24 h-24 rounded-full ${color} opacity-20 animate-pulse-ring`} />
          </div>
          <div className={`w-20 h-20 rounded-full ${color} flex items-center justify-center text-white text-2xl font-bold relative z-10`}>
            {initials}
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Incoming Call</p>
          <h2 className="text-xl font-bold text-white truncate">{name}</h2>
          {contact && <p className="text-sm text-gray-500 mt-0.5">{from}</p>}
        </div>

        {/* Accept / Reject */}
        <div className="flex items-center justify-around">
          {/* Reject */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onReject}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform glow-red"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)"/>
              </svg>
            </button>
            <span className="text-xs text-gray-500">Decline</span>
          </div>

          {/* Accept */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onAccept}
              className="w-16 h-16 rounded-full bg-[#00ff88] flex items-center justify-center shadow-lg active:scale-95 transition-transform glow-green"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="black">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
            </button>
            <span className="text-xs text-gray-500">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
