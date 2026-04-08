export type MockSettings = {
  mockEnabled: 'true' | 'false';
  keepSessionLogged: 'true' | 'false';
  loginBlocked: 'true' | 'false';
  bffUrl: string;
  validToken: 'success' | 'invalid';
};

export const MOCK_STORAGE_KEY = 'mockSettings';

export const getMockSettings = (): MockSettings => {
  const stored = localStorage.getItem(MOCK_STORAGE_KEY);

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<MockSettings>;
      return {
        mockEnabled: parsed.mockEnabled ?? 'false',
        keepSessionLogged: parsed.keepSessionLogged ?? 'false',
        loginBlocked: parsed.loginBlocked ?? 'false',
        bffUrl: parsed.bffUrl ?? '',
        validToken: parsed.validToken ?? 'success',
      };
    } catch {
      localStorage.removeItem(MOCK_STORAGE_KEY);
    }
  }

  return {
    mockEnabled: 'false',
    keepSessionLogged: 'false',
    bffUrl: '',
    validToken: 'success',
    loginBlocked: 'false',
  };
};

export const persistMockSettings = (settings: MockSettings) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(settings));
};

export const isMockEnabled = () => getMockSettings().mockEnabled === 'true';

export const isMockKeepSessionLogged = () => {
  return getMockSettings().keepSessionLogged === 'true';
};

export const isLoginBlocked = () => {
  return getMockSettings().loginBlocked === 'true';
};

export const getMockValidToken = () => {
  return getMockSettings().validToken ?? 'success';
};

export const getMockBffUrl = () => getMockSettings().bffUrl;
