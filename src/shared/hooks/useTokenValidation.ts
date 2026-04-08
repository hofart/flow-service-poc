import { http } from 'core/http';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAccessToken, removeAccessToken } from 'shared/utils/localStorage';
import { useToast } from 'vsoft-design-system';
import { useErrorHandler } from './useErrorHandler';

export const useTokenValidation = defineStore('validateToken', () => {
  const loading = ref(false);

  const { open } = useToast();

  const { handleError } = useErrorHandler();

  const validateCurrentToken = async () => {
    const token = getAccessToken();

    if (!token) {
      removeAccessToken();

      return false;
    }

    loading.value = true;

    try {
      const result = await http.post<{ valid: boolean }>('/validate-token', { token });

      const isSuccess = result.data?.valid;

      if (!isSuccess) {
        removeAccessToken();
      }

      return isSuccess;
    } catch (error: any) {
      const message = error?.response?.data?.message ?? error?.message ?? 'Erro ao validar token';

      open({
        type: 'error',
        title: 'Erro ao validar acesso!',
        message,
      });

      handleError(
        'api',
        'Validate token error',
        { context: 'validateToken' },
        message
      );

      removeAccessToken();

      return false;
    } finally {
      loading.value = false;
    }
  };

  const validateTokenByValue = async (token: string) => {
    try {
      const result = await http.post<{ valid: boolean }>('/validate-token', { token });

      return result.data?.valid;
    } catch {
      return false;
    }
  };

  return {
    loading,
    validateCurrentToken,
    validateTokenByValue,
  };
});
