'use client';

import { useState } from 'react';

const BUDGETS = [
  'Under $5,000',
  '$5,000 – $10,000',
  '$10,000 – $25,000',
  '$25,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000+',
  'Not sure yet',
];

const TIMELINES = [
  'ASAP',
  'Within 1 month',
  '1–3 months',
  '3+ months',
  'Just exploring',
];

const SOURCES = [
  'Referral',
  'Google',
  'Social Media',
  'AI Search',
  'Event / Conference',
  'Other',
];

function PillGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt === value ? '' : opt)}
          className={`pill${value === opt ? ' pill-active' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-editorial">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full border border-black px-5 py-3 text-sm text-black bg-white focus:outline-none transition-colors duration-150 placeholder:text-neutral-400 placeholder:font-normal';

export default function InquireForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    timeline: '',
    project: '',
    source: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(field: keyof typeof form) {
    return (v: string) => setForm((f) => ({ ...f, [field]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.error('Inquiry submit error:', err);
    }
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="flex flex-col justify-center"
        style={{ minHeight: 'calc(100vh - var(--nav-height) - 4rem - 6rem)' }}
      >
        <p className="text-sm tracking-[0.12em] uppercase text-black font-semibold mb-6">
          Received
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Thanks, {form.name.split(' ')[0]}.
        </h2>
        <p className="text-base text-neutral-700 leading-relaxed">
          We&rsquo;ll review your project details and be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12 pb-24">

      {/* Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Name">
          <input
            type="text"
            required
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => set('name')(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            required
            placeholder="jane@company.com"
            value={form.email}
            onChange={(e) => set('email')(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Company */}
      <Field label="Company / Organization">
        <input
          type="text"
          placeholder="Good Company"
          value={form.company}
          onChange={(e) => set('company')(e.target.value)}
          className={inputClass}
        />
      </Field>

      {/* Budget */}
      <Field label="Estimated Budget">
        <PillGroup options={BUDGETS} value={form.budget} onChange={set('budget')} />
      </Field>

      {/* Timeline */}
      <Field label="Timeline">
        <PillGroup options={TIMELINES} value={form.timeline} onChange={set('timeline')} />
      </Field>

      {/* Project description */}
      <Field label="Tell us about your project">
        <textarea
          required
          rows={5}
          placeholder="What are you hoping to create? Share the idea, goals, or vision for the project."
          value={form.project}
          onChange={(e) => set('project')(e.target.value)}
          className="w-full border border-black px-5 py-4 text-sm text-black bg-white focus:outline-none transition-colors duration-150 placeholder:text-neutral-400 placeholder:font-normal resize-none"
        />
      </Field>

      {/* Source */}
      <Field label="How did you hear about us?">
        <PillGroup options={SOURCES} value={form.source} onChange={set('source')} />
      </Field>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white text-[16px] tracking-[0.04em] uppercase font-bold hover:bg-neutral-800 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Sending…' : 'Send Inquiry'}
        </button>
      </div>

    </form>
  );
}
