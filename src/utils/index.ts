export async function apiPost(path: string, body: any, timeoutMs = 20000) {
  const { APP_CONFIG } = await import('../constants/config');
  const url = `${APP_CONFIG.apiBaseUrl}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      try { const j = await res.json(); message = j?.error?.message || message; } catch {}
      throw new Error(message);
    }
    return await res.json();
  } catch (e: any) {
    if (e?.name === 'AbortError') throw new Error('Request timeout');
    if (e?.message?.includes('Network request failed')) throw new Error('Cannot reach server');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}


