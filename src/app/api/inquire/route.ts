import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, company, budget, timeline, project, source } = body;

  if (!name || !email || !project) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const errors: string[] = [];

  // ── Send emails via Resend ───────────────────────────────────
  try {
    await resend.batch.send([
      // Internal notification to Blaske Studio
      {
        from: 'Blaske Studio <hello@blaskestudio.com>',
        to: 'hello@blaskestudio.com',
        replyTo: email,
        subject: `New Inquiry from ${name}${company ? ` — ${company}` : ''}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #111;">
            <h2 style="margin-bottom: 4px;">New Inquiry</h2>
            <hr style="border: none; border-top: 1px solid #ddd; margin-bottom: 24px;" />
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
            ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
            ${source ? `<p><strong>How they found us:</strong> ${source}</p>` : ''}
            <h3 style="margin-top: 32px;">Project Details</h3>
            <p style="line-height: 1.6;">${project.replace(/\n/g, '<br />')}</p>
          </div>
        `,
      },
      // Confirmation to the person who submitted
      {
        from: 'Blaske Studio <hello@blaskestudio.com>',
        to: email,
        subject: `We received your inquiry, ${name.split(' ')[0]}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #111;">
            <h2 style="margin-bottom: 4px;">Thanks for reaching out.</h2>
            <hr style="border: none; border-top: 1px solid #ddd; margin-bottom: 24px;" />
            <p>Hi ${name.split(' ')[0]},</p>
            <p>We've received your inquiry and will review your project details shortly. We typically follow up within 1–2 business days.</p>
            <p>In the meantime, feel free to explore our work at <a href="https://blaskestudio.com/work">blaskestudio.com</a>.</p>
            <br />
            <p>— The Blaske Studio Team</p>
            <img src="https://blaske.studio/logo.webp" alt="Blaske Studio" style="height: 48px; width: auto; margin: 16px 0 8px;" />
            <p style="color: #666; margin: 0;">--</p>
            <p style="margin: 8px 0 4px;">W. <a href="https://blaske.studio/">blaske.studio</a></p>
            <p style="margin: 4px 0;">E. <a href="mailto:hello@blaskestudio.com">hello@blaskestudio.com</a></p>
            <p style="margin: 4px 0;">B. <a href="https://blaskestudio.substack.com/">Studio Updates</a></p>
          </div>
        `,
      },
    ]);
  } catch (err) {
    console.error('Resend error:', err);
    errors.push('email');
  }

  // ── Append to Notion database ────────────────────────────────
  const notionSecret = process.env.NOTION_SECRET;
  const notionDbId = process.env.NOTION_DATABASE_ID;
  if (notionSecret && notionDbId) {
    try {
      const notionRes = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionSecret}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          parent: { database_id: notionDbId },
          properties: {
            Name: { title: [{ text: { content: name } }] },
            Email: { email: email },
            Company: { rich_text: [{ text: { content: company || '' } }] },
            Budget: { select: budget ? { name: budget } : null },
            'Timeline ': { select: timeline ? { name: timeline } : null },
            Source: { select: source ? { name: source } : null },
            Project: { rich_text: [{ text: { content: project } }] },
          },
        }),
      });
      if (!notionRes.ok) {
        const body = await notionRes.json().catch(() => ({}));
        console.error('Notion API error:', notionRes.status, JSON.stringify(body));
        errors.push('notion');
      }
    } catch (err) {
      console.error('Notion error:', err);
      errors.push('notion');
    }
  } else {
    console.error('Notion env vars missing — NOTION_SECRET:', !!notionSecret, 'NOTION_DATABASE_ID:', !!notionDbId);
  }

  return NextResponse.json({ ok: true, errors });
}
