"use client";

import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const APP_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'CONTACT', href: '/contact' },
];

// The email route lives at app/api/contact/route.js
const API_URL = '/api/contact';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' }); // "website" = honeypot
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');

      setStatus('success');
      setForm({ name: '', email: '', message: '', website: '' });
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  // Underline-only field, like the design
  const fieldClass =
    'w-full min-w-0 flex-1 border-0 border-b border-[#3A3A3A] bg-transparent px-1 pb-1 text-sm font-medium text-[#1C1C1C] outline-none placeholder:text-[#8A8A8A] focus:border-b-2 focus:border-[#0B1F6E]';
  const labelClass = 'w-[88px] shrink-0 font-serif text-lg font-bold text-[#1C1C1C] sm:w-[110px] sm:text-xl';

  return (
    <div className="min-h-screen bg-[#0B1F6E] flex flex-col">
      <Navbar links={APP_LINKS} />

      <main className="flex flex-1 items-center justify-center px-3 py-10 sm:px-4">
        <div className="w-full max-w-2xl rounded-[32px] bg-[#D9D9D9] px-6 py-12 sm:px-12 sm:py-14">
          <h1 className="text-center font-serif text-2xl font-bold text-[#1C1C1C]">Contact</h1>

          {status === 'success' ? (
            <div className="mt-12 rounded-xl bg-[#BFE6C4] px-4 py-5 text-center text-sm font-medium text-[#0A1930]">
              Message sent. Thanks, I&apos;ll reply soon.
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-3 block w-full text-sm font-semibold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-14 space-y-10">
              <div className="flex items-end gap-2">
                <label htmlFor="name" className={labelClass}>
                  Name :
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={update}
                  required
                  maxLength={100}
                  className={fieldClass}
                  placeholder="Your name"
                />
              </div>

              <div className="flex items-end gap-2">
                <label htmlFor="email" className={labelClass}>
                  Email:
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  required
                  maxLength={200}
                  className={fieldClass}
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex items-end gap-2">
                <label htmlFor="message" className={labelClass}>
                  Message:
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={update}
                  required
                  rows={2}
                  maxLength={3000}
                  className={`${fieldClass} resize-none`}
                  placeholder="Write your message"
                />
              </div>

              {/* Honeypot: hidden from people, bots fill it in */}
              <input
                name="website"
                value={form.website}
                onChange={update}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {status === 'error' && (
                <p role="alert" className="text-center text-sm font-medium text-[#D14B3A]">
                  {error}
                </p>
              )}

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="rounded-md border border-[#0B1F6E] bg-[#D4ED31] px-6 py-1.5 font-serif text-sm font-bold text-[#0A1930] transition-colors hover:bg-[#bacc22] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : 'Submit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer links={APP_LINKS} />
    </div>
  );
}