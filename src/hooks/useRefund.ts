import { useMutation } from '@tanstack/react-query';

import { createRefund } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { RefundPayloadType } from '@/types';

export default function useRefund() {
  const mutation = useMutation({
    mutationFn: async (payload: RefundPayloadType) => {
      const response = await createRefund(payload);
      if (!response.success) {
        throw new Error(response.message ?? DEFAULT_ERROR_MESSAGE);
      }
      return response;
    },
  });

  return {
    createRefund: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
