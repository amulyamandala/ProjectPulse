export const getAuthToken = () => localStorage.getItem('accessToken');
export const setAuthToken = (token: string) => localStorage.setItem('accessToken', token);
export const clearAuthToken = () => localStorage.removeItem('accessToken');

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // Keep for refresh token cookie if needed
  });

  if (res.status === 401) {
    // Optionally handle token refresh here or redirect to login
    // For now, we will just throw
  }

  return res;
};
