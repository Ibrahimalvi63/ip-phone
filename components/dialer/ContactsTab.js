'use client';
import { useState, useEffect } from 'react';
import { getContacts, saveContact, deleteContact } from '../../lib/storage';
import { getInitials, avatarColor } from '../../lib/utils';

export default function ContactsTab({ onDial, prefillContact, onPrefillConsumed }) {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | contact obj (edit)
  const [form, setForm] = useState({ name: '', phone: '', email: '', note: '' });
  const [detail, setDetail] = useState(null); // contact detail sheet
  const [formError, setFormError] = useState('');

  const refresh = () => setContacts(getContacts());
  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!prefillContact) return;
    if (prefillContact) {
      setForm({
        name: '',
        phone: prefillContact,
        email: '',
        note: '',
      });

      setFormError('');
      setModal('add');
      onPrefillConsumed?.();
    }
  }, [prefillContact, onPrefillConsumed]);

  const openAdd = () => {
    setForm({ name: '', phone: '', email: '', note: '' });
    setFormError('');
    setModal('add');
  };

  const openEdit = (c) => {
    setForm({ name: c.name, phone: c.phone, email: c.email || '', note: c.note || '' });
    setFormError('');
    setModal(c);
    setDetail(null);
  };

  const handleSave = () => {
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    if (!form.phone.trim()) { setFormError('Phone number is required'); return; }
    saveContact(modal === 'add' ? form : { ...modal, ...form });
    refresh();
    setModal(null);
  };

  const handleDelete = (id) => {
    deleteContact(id);
    refresh();
    setDetail(null);
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  // Group by first letter
  const grouped = filtered.reduce((acc, c) => {
    const letter = c.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h1 className="text-xl font-bold">Contacts</h1>
        <button
          onClick={openAdd}
          className="w-9 h-9 rounded-full bg-[rgba(0,255,136,0.12)] border border-[rgba(0,255,136,0.25)] flex items-center justify-center text-[#00ff88] active:scale-90 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or number"
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            <p className="text-sm">{search ? 'No results' : 'No contacts yet'}</p>
            {!search && (
              <button onClick={openAdd} className="text-[#00ff88] text-sm font-medium hover:underline">
                Add your first contact
              </button>
            )}
          </div>
        ) : (
          Object.keys(grouped).sort().map(letter => (
            <div key={letter}>
              <p className="section-header">{letter}</p>
              {grouped[letter].map(c => (
                <button
                  key={c.id}
                  onClick={() => setDetail(c)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1a1a] transition-colors text-left"
                >
                  <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold ${avatarColor(c.name)}`}>
                    {getInitials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">{c.phone}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onDial(c.phone); }}
                    className="w-9 h-9 rounded-full bg-[rgba(0,255,136,0.1)] border border-[rgba(0,255,136,0.2)] flex items-center justify-center text-[#00ff88] flex-shrink-0 active:scale-90 transition-all"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                    </svg>
                  </button>
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Contact detail sheet */}
      {detail && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#1e1e1e] border border-[#2a2a2a] rounded-3xl p-6 animate-slide-up">
            <div className="flex flex-col items-center mb-5">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 ${avatarColor(detail.name)}`}>
                {getInitials(detail.name)}
              </div>
              <h2 className="text-xl font-bold text-white">{detail.name}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{detail.phone}</p>
              {detail.email && <p className="text-xs text-gray-600 mt-0.5">{detail.email}</p>}
              {detail.note && <p className="text-xs text-gray-600 mt-2 italic text-center">{detail.note}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => { onDial(detail.phone); setDetail(null); }} className="btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" /></svg>
                Call
              </button>
              <button onClick={() => openEdit(detail)} className="btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                Edit
              </button>
            </div>
            <button
              onClick={() => handleDelete(detail.id)}
              className="w-full py-2.5 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Delete Contact
            </button>
            <button
              onClick={() => setDetail(null)}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#1e1e1e] border border-[#2a2a2a] rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{modal === 'add' ? 'New Contact' : 'Edit Contact'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-gray-300 transition-colors p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="mb-4 text-xs text-red-400 bg-[rgba(255,68,68,0.1)] border border-[rgba(255,68,68,0.2)] rounded-xl px-3 py-2">
                {formError}
              </div>
            )}

            <div className="space-y-3 mb-5">
              {[
                { key: 'name', label: 'Full Name *', type: 'text', placeholder: 'John Doe' },
                { key: 'phone', label: 'Phone Number *', type: 'tel', placeholder: '+8801XXXXXXXXX' },
                { key: 'email', label: 'Email (optional)', type: 'email', placeholder: 'email@example.com' },
                { key: 'note', label: 'Note (optional)', type: 'text', placeholder: 'Work colleague…' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setFormError(''); }}
                    placeholder={placeholder}
                    className="input-field"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setModal(null)} className="btn-ghost">Cancel</button>
              <button onClick={handleSave} className="btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
