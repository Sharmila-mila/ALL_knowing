const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export async function fetchHealth(): Promise<{ status: string; supabase_connected: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', supabase_connected: false };
  }
}

export async function parseLead(email: string) {
  const res = await fetch(`${API_BASE}/api/lead/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Failed to parse lead');
  return res.json();
}

export async function investigateLead(email: string, max_profiles = 5) {
  const res = await fetch(`${API_BASE}/api/lead/investigate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, max_profiles }),
  });
  if (!res.ok) throw new Error('Failed to investigate lead');
  return res.json();
}

export async function searchPeople(query: { name?: string; company?: string; title?: string; location?: string }) {
  const res = await fetch(`${API_BASE}/api/linkedin/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  if (!res.ok) throw new Error('Failed to search people');
  return res.json();
}

export async function fetchCompanyEmployees(company: string) {
  const res = await fetch(`${API_BASE}/api/company/employees?company=${encodeURIComponent(company)}`);
  if (!res.ok) throw new Error('Failed to load company employees');
  return res.json();
}

export async function refreshBookmarks(queries: string[]) {
  const res = await fetch(`${API_BASE}/api/company/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queries }),
  });
  if (!res.ok) throw new Error('Failed to refresh bookmarks');
  return res.json();
}

export function subscribeCompanyStream(query: string, onMessage: (data: any) => void, onError: (err: any) => void) {
  const url = `${API_BASE}/api/company/stream?query=${encodeURIComponent(query)}`;
  const es = new EventSource(url);
  es.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data);
      onMessage(parsed);
      if (parsed.done) es.close();
    } catch (err) {
      onError(err);
    }
  };
  es.onerror = (err) => {
    onError(err);
    es.close();
  };
  return () => es.close();
}

export function subscribePeopleStream(urls: string[], hints: any, onMessage: (data: any) => void, onError: (err: any) => void) {
  const url = `${API_BASE}/api/linkedin/stream?urls=${encodeURIComponent(JSON.stringify(urls))}&hints=${encodeURIComponent(JSON.stringify(hints))}`;
  const es = new EventSource(url);
  es.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data);
      onMessage(parsed);
      if (parsed.done) es.close();
    } catch (err) {
      onError(err);
    }
  };
  es.onerror = (err) => {
    onError(err);
    es.close();
  };
  return () => es.close();
}
