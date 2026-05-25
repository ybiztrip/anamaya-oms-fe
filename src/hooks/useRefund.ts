import { useMutation } from '@tanstack/react-query';

import { createRefund } from '@/api';
import type { RefundPayloadType } from '@/types';

export default function useRefund() {
  const mutation = useMutation({
    mutationFn: (payload: RefundPayloadType) => createRefund(payload),
  });

  return {
    createRefund: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
