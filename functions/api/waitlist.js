const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export async function onRequestPost({ request, env }) {
  if (!env.WAITLIST_DB) return json({ error: 'Waitlist storage is not configured.' }, 503);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return json({ error: 'Expected JSON.' }, 415);
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > 2048) return json({ error: 'Request too large.' }, 413);
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Enter a valid email address.' }, 400);
  }

  try {
    await env.WAITLIST_DB.prepare('INSERT INTO waitlist (email) VALUES (?) ON CONFLICT(email) DO NOTHING').bind(email).run();
    // A duplicate email is already stored; do not expose whether an address has signed up before.
    return json({ saved: true });
  } catch (error) {
    console.error('Waitlist insert failed', error);
    return json({ error: 'Could not save email.' }, 503);
  }
}

export function onRequestGet() {
  return json({ error: 'Method not allowed.' }, 405);
}
