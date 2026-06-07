const BASE = '/api';

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function request<T>(method: string, path: string, body?: any): Promise<T> {
  const r = await fetch(BASE + path, { method, headers: headers(), body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) { const e = await r.json().catch(() => ({ error: 'Серверийн алдаа' })); throw new Error(e.error); }
  return r.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) => request<any>('POST', '/auth/login', { email, password }),
    register: (data: any) => request<any>('POST', '/auth/register', data),
    me: () => request<{ user: any } | null>('GET', '/auth/me').catch(() => null),
  },
  materials: {
    list: (regulation?: number) => request<any[]>('GET', '/materials' + (regulation ? `?regulation=${regulation}` : '')),
    create: (data: any) => request<any>('POST', '/materials', data),
    delete: (id: number) => request<any>('DELETE', `/materials/${id}`),
  },
  quizzes: {
    list: (regulation?: number, chapter?: number) => {
      let q = '';
      if (regulation) q += `?regulation=${regulation}`;
      if (chapter) q += (q ? '&' : '?') + `chapter=${chapter}`;
      return request<any[]>('GET', '/quizzes' + q);
    },
    create: (data: any) => request<any>('POST', '/quizzes', data),
    delete: (id: number) => request<any>('DELETE', `/quizzes/${id}`),
  },
  scores: {
    save: (chapter: string, score: number, total: number) =>
      request<any>('POST', '/scores', { chapter, score, total }),
    leaderboard: () => request<any[]>('GET', '/scores/leaderboard'),
    progress: () => request<any>('GET', '/scores/progress'),
  }
};
