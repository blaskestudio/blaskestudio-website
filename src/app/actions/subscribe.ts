'use server';

export type SubscribeResult = { ok: true } | { ok: false; error: string };

export async function subscribe(formData: FormData): Promise<SubscribeResult> {
  const email = (formData.get('email') as string)?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  try {
    const body = new URLSearchParams({ email, utm_source: 'website' });
    const res = await fetch('https://blaskestudio.substack.com/api/v1/free', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    // Substack returns 200 on success and various errors on failure
    if (res.ok) return { ok: true };

    const text = await res.text();
    if (text.includes('already subscribed')) {
      return { ok: true }; // treat as success — they're already in the list
    }

    return { ok: false, error: 'Something went wrong. Try again.' };
  } catch {
    return { ok: false, error: 'Could not connect. Try again.' };
  }
}
