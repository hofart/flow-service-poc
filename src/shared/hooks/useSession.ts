import { useTranslation } from 'i18next-vue';
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import {
  getAccessToken,
  getCurrentUser,
  removeAccessToken,
  removeCurrentUser,
} from 'shared/utils/localStorage';
import { useTokenValidation } from 'shared/hooks/useTokenValidation';
import { isMockKeepSessionLogged } from 'shared/utils/mock';

export const useSession = defineStore('session', () => {
  const router = useRouter();

  const isAuthenticated = ref(false);

  const currentUser = ref(getCurrentUser());

  const { t } = useTranslation();

  const { validateCurrentToken } = useTokenValidation();

  const initSession = async () => {
    const isMockLogged = isMockKeepSessionLogged();

    if (isMockLogged) {
      isAuthenticated.value = true;
      return;
    }

    const token = getAccessToken();

    if (token) {
      const isValid = await validateCurrentToken();
      isAuthenticated.value = isValid ?? false;
    } else {
      isAuthenticated.value = false;
    }
  };

  const setAuthenticated = () => {
    isAuthenticated.value = true;
  };

  const logout = () => {
    removeAccessToken();
    removeCurrentUser();
    currentUser.value = null;
    isAuthenticated.value = false;
  };

  const loginAndRedirect = (
    redirectTo = t('routes.home.children.dashboard.name')
  ) => {
    isAuthenticated.value = true;
    router.push(redirectTo);
  };

  const logoutAndRedirect = (name = t('routes.auth.children.login.name')) => {
    logout();
    router.push({ name });
  };

  initSession();

  return {
    isAuthenticated,
    currentUser,
    setAuthenticated,
    logout,
    loginAndRedirect,
    logoutAndRedirect,
    initSession,
  };
});
