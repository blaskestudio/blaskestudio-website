'use client';

import { useActionState } from 'react';
import { subscribe, SubscribeResult } from '@/app/actions/subscribe';

const initial: SubscribeResult | null = null;

export default function NewsletterForm() {
  const [result, action, pending] = useActionState(
    async (_prev: SubscribeResult | null, formData: FormData) => subscribe(formData),
    initial
  );

  if (result?.ok) {
    return (
      <p className="text-sm text-neutral-500 tracking-wide">
        You&apos;re subscribed. Thanks for following along.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3 max-w-xs">
      <p className="text-[14px] md:text-[17px] lg:text-[20px] tracking-[0.04em] uppercase text-black font-bold leading-none">
        News &amp; Updates
      </p>
      {/* Pill-shaped input + submit as a unified unit — height locked to match .pill */}
      <div
        className="flex overflow-hidden border border-black transition-colors duration-150"
        style={{ lineHeight: 1 }}
      >
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          className="flex-1 min-w-0 text-[10px] tracking-[0.12em] font-semibold uppercase text-black placeholder:text-[16px] placeholder:text-neutral-400 placeholder:font-normal placeholder:tracking-normal placeholder:normal-case bg-white outline-none leading-none"
          style={{ padding: '0.75rem 1.25rem', lineHeight: 1 }}
        />
        <button
          type="submit"
          disabled={pending}
          className="text-[10px] tracking-[0.12em] uppercase font-semibold bg-black text-white shrink-0 hover:bg-neutral-800 transition-colors duration-150 disabled:opacity-50 cursor-pointer leading-none"
          style={{ padding: '0.75rem 1.25rem', lineHeight: 1 }}
        >
          {pending ? '…' : 'Sign Up'}
        </button>
      </div>
      {result && !result.ok && (
        <p className="text-xs text-red-500">{result.error}</p>
      )}
    </form>
  );
}
