import { ref, Ref } from 'vue';
import { useToast } from 'vsoft-design-system';
import { useErrorHandler } from 'shared/hooks/useErrorHandler';

interface User {
  [key: string]: unknown;
}

interface StatusUpdateOptions<T, R = void> {
  items: Ref<T[]>;
  idKey: keyof T;
  statusKey: keyof T;
  updateFn: (id: string, isActive: boolean) => Promise<R>;
  getErrorMessage: (item: T, isActive: boolean) => string;
  errorTitle?: string;
  onSuccess?: (item: T, isActive: boolean) => void;
  bulkUpdateFn?: (ids: string[], isActive: boolean) => Promise<R>;
  usersKey?: keyof T;
  subsidiariesKey?: keyof T;
}

export const useStatusUpdate = <T extends Record<string, any>, R = void>(
  options: StatusUpdateOptions<T, R>
) => {
  const {
    items,
    idKey,
    statusKey,
    updateFn,
    getErrorMessage,
    errorTitle = 'Erro na requisição',
    onSuccess,
    bulkUpdateFn,
    usersKey,
    subsidiariesKey,
  } = options;

  const updatingId = ref<string | undefined>();

  const { open } = useToast();

  const { handleError } = useErrorHandler();

  const collectAllUserIds = (item: T): string[] => {
    const userIds: string[] = [];

    const addUsersFromItem = (item: T): void => {
      if (!usersKey || !item[usersKey]) {
        return;
      }

      const users = item[usersKey] as User[];
      users.forEach((user) => {
        if (user[String(idKey)]) {
          userIds.push(String(user[String(idKey)]));
        }
      });
    };

    const addUsersFromSubsidiaries = (item: T): void => {
      if (!subsidiariesKey || !item[subsidiariesKey]) {
        return;
      }

      const subsidiaries = item[subsidiariesKey] as T[];
      subsidiaries.forEach((subsidiary) => {
        userIds.push(...collectAllUserIds(subsidiary));
      });
    };

    addUsersFromItem(item);
    addUsersFromSubsidiaries(item);

    return userIds;
  };

  const updateItemStatusRecursively = (item: T, isActive: boolean): T => {
    const updatedItem = { ...item, [statusKey]: isActive };

    const updateUsers = (item: T) => {
      if (!usersKey || !item[usersKey]) {
        return;
      }

      const users = item[usersKey] as User[];

      item[usersKey] = users.map((user) => {
        return {
          ...user,
          [statusKey]: isActive,
        };
      }) as T[keyof T];
    };

    const updateSubsidiaries = (item: T): void => {
      if (!subsidiariesKey || !item[subsidiariesKey]) {
        return;
      }

      const subsidiaries = item[subsidiariesKey] as T[];

      item[subsidiariesKey] = subsidiaries.map((subsidiary) => {
        return updateItemStatusRecursively(subsidiary, isActive);
      }) as T[keyof T];
    };

    updateUsers(updatedItem);

    updateSubsidiaries(updatedItem);

    return updatedItem;
  };

  const findItemIndex = (item: T, itemsArray: T[]): number => {
    const itemId = String(item[idKey]);
    return itemsArray.findIndex((i) => String(i[idKey]) === itemId);
  };

  const applyRecursiveUpdate = (
    item: T,
    isActive: boolean,
    itemsArray: T[]
  ): void => {
    const index = findItemIndex(item, itemsArray);

    if (index !== -1) {
      itemsArray[index] = updateItemStatusRecursively(
        itemsArray[index],
        isActive
      );
    }
  };

  const revertItemStatusRecursively = (
    item: T,
    isActive: boolean,
    itemsArray: T[]
  ): void => {
    applyRecursiveUpdate(item, !isActive, itemsArray);
  };

  const updateItemStatus = (item: T, isActive: boolean): void => {
    const index = findItemIndex(item, items.value);

    if (index !== -1) {
      items.value[index] = {
        ...items.value[index],
        [statusKey]: isActive,
      };
    }
  };

  const showErrorToast = (item: T, isActive: boolean): void => {
    const message = getErrorMessage(item, isActive);
    open({
      title: errorTitle,
      message,
      type: 'error',
    });
  };

  const handleUpdateError = (
    item: T,
    isActive: boolean,
    error: unknown
  ): never => {
    handleError(
      'api',
      'Failed to update status',
      {
        context: 'useStatusUpdate',
        item,
        isActive,
      },
      error
    );

    showErrorToast(item, isActive);

    updateItemStatus(item, !isActive);

    throw error;
  };

  const handleUpdate = async (item: T, isActive: boolean): Promise<void> => {
    const itemId = String(item[idKey]);

    updatingId.value = itemId;

    updateItemStatus(item, isActive);

    try {
      await updateFn(itemId, isActive);

      onSuccess?.(item, isActive);
    } catch (error) {
      handleUpdateError(item, isActive, error);
    } finally {
      updatingId.value = undefined;
    }
  };

  const validateBulkUpdateFunction = (): void => {
    if (!bulkUpdateFn) {
      throw new Error('bulkUpdateFn is required for bulk updates');
    }
  };

  const handleBulkUpdateError = (
    item: T,
    isActive: boolean,
    userIds: string[],
    error: unknown
  ): never => {
    handleError(
      'api',
      'Failed to bulk update status',
      {
        context: 'useStatusUpdate.handleBulkUpdate',
        item,
        isActive,
        userIds,
      },
      error
    );

    showErrorToast(item, isActive);

    revertItemStatusRecursively(item, isActive, items.value);

    throw error;
  };

  const handleBulkUpdate = async (
    item: T,
    isActive: boolean
  ): Promise<void> => {
    validateBulkUpdateFunction();

    const itemId = String(item[idKey]);
    updatingId.value = itemId;

    const userIds = collectAllUserIds(item);

    if (userIds.length === 0) {
      return;
    }

    applyRecursiveUpdate(item, isActive, items.value);

    try {
      await bulkUpdateFn!(userIds, isActive);
      onSuccess?.(item, isActive);
    } catch (error) {
      handleBulkUpdateError(item, isActive, userIds, error);
    } finally {
      updatingId.value = undefined;
    }
  };

  return {
    updatingId,
    handleUpdate,
    handleBulkUpdate,
  };
};
