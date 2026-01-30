// Adiciona automaticamente o token JWT nas requisições feitas com fetch
const originalFetch = window.fetch.bind(window);

if (!window.__fetchAuthInstalled) {
  window.__fetchAuthInstalled = true;

  window.fetch = (input, init = {}) => {
    const token = localStorage.getItem('token');

    // Normaliza headers
    const headers = new Headers(init.headers || (input && input.headers) || undefined);

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return originalFetch(input, { ...init, headers });
  };
}
