'use client';
import { useState, useEffect, useCallback } from 'react';
import { getCallLog, deleteCallEntry, clearCallLog } from '../../lib/storage';
import { formatDuration, formatTimestamp, getInitials, avatarColor } from '../../lib/utils';

const FILTERS = ['All', 'Missed', 'Incoming', 'Outgoing'];

export default function CallsTab({ onDial }) {
  const [filter, setFilter]   = useState('All');
  const [log, setLog]         = useState([]);
  const [showMenu, setShowMenu] = useState(null); // entry id

  const refresh = () => setLog(getCallLog());
  useEffect(() => { refresh(); }, []);

  const filtered = log.filter(e => {
    if (filter === 'All')      return true;
    if (filter === 'Missed')   return e.type === 'missed';
    if (filter === 'Incoming') return e.type === 'incoming';
    if (filter === 'Outgoing') return e.type === 'outgoing';
    return true;
  });

  const handleDelete = (id) => {
    deleteCallEntry(id);
    refresh();
    setShowMenu(null);
  };

  const handleClearAll = () => {
    clearCallLog();
    refresh();
  };

  const callTypeIcon = (type) => {
    if (type === 'missed')   return <span className="text-red-400">↙</span>;
    if (type === 'incoming') return <span className="text-[#00ff88]">↙</span>;
    return <span className="text-blue-400">↗</span>;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold">Recent Calls</h1>
        {log.length > 0 && (
          <button onClick={handleClearAll} className="text-xs text-red-400 hover:text-red-300 transition-colors py-1 px-2">
            Clear All
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? 'bg-[rgba(0,255,136,0.12)] border-[rgba(0,255,136,0.3)] text-[#00ff88]'
                : 'bg-[#1e1e1e] border-[#2a2a2a] text-gray-500'
            }`}
          >
            {f}
            {f === 'Missed' && log.filter(e => e.type === 'missed').length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                {log.filter(e => e.type === 'missed').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            <p className="text-sm">No {filter === 'All' ? '' : filter.toLowerCase()} calls</p>
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e1e]">
            {filtered.map(entry => {
              const name = entry.name || entry.number;
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a1a1a] transition-colors relative"
                >
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${avatarColor(name)}`}>
                    {getInitials(name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {callTypeIcon(entry.type)}
                      <span className={`font-semibold text-sm truncate ${entry.type === 'missed' ? 'text-red-400' : 'text-white'}`}>
                        {entry.name || entry.number}
                      </span>
                    </div>
                    {entry.name && (
                      <p className="text-xs text-gray-500 truncate">{entry.number}</p>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-600">{formatTimestamp(entry.timestamp)}</span>
                      {entry.duration > 0 && (
                        <>
                          <span className="text-gray-700">·</span>
                          <span className="text-xs text-gray-600">{formatDuration(entry.duration)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDial(entry.number)}
                      className="w-9 h-9 rounded-full bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center text-[#00ff88] active:scale-90 transition-all"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowMenu(showMenu === entry.id ? null : entry.id)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-300 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                      </svg>
                    </button>
                  </div>

                  {/* Context menu */}
                  {showMenu === entry.id && (
                    <div className="absolute right-4 top-12 z-10 bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl shadow-xl overflow-hidden min-w-[140px]">
                      <button
                        onClick={() => { onDial(entry.number); setShowMenu(null); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>
                        Call back
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-[#2a2a2a] transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
