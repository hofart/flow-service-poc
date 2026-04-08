const ACCESS_TOKEN_KEY = 'accessToken';
const CURRENT_USER_KEY = 'current_user';

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const hasAccessToken = () => {
  return getAccessToken() !== null;
};

export const setCurrentUser = (user: any) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const clear = () => {
  localStorage.clear();
};
