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
      <p className="text-base text-neutral-600">
        You&apos;re subscribed. Thanks for following along.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3 w-full">
      <p className="text-base tracking-[0.08em] uppercase font-medium text-black">
        News
      </p>
      <p className="text-base text-black font-medium leading-snug">
        Quarterly newsletter in your inbox
      </p>
      <div className="flex overflow-hidden border border-black">
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          required
          className="flex-1 min-w-0 px-6 py-3 text-[16px] font-bold text-black placeholder:text-neutral-400 placeholder:font-bold bg-white outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-3 text-[16px] tracking-[0.04em] uppercase font-bold bg-black text-white shrink-0 hover:bg-neutral-800 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
        >
          {pending ? '…' : 'Sign Up'}
        </button>
      </div>
      {result && !result.ok && (
        <p className="text-base text-red-500">{result.error}</p>
      )}
    </form>
  );
}
