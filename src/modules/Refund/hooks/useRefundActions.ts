import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelRefund, payRefund } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import { REFUNDS } from '@/constants/queryKey';
import type { RefundCancelPayloadType, RefundPaidPayloadType } from '@/types';

export default function useRefundActions() {
  const queryClient = useQueryClient();

  const payMutation = useMutation({
    mutationFn: async (payload: RefundPaidPayloadType) => {
      const response = await payRefund(payload ?? {});
      if (!response.success) {
        throw new Error(response.message ?? DEFAULT_ERROR_MESSAGE);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REFUNDS] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: RefundCancelPayloadType }) => {
      const response = await cancelRefund(id, payload ?? {});
      if (!response.success) {
        throw new Error(response.message ?? DEFAULT_ERROR_MESSAGE);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REFUNDS] });
    },
  });

  return {
    payRefund: payMutation.mutateAsync,
    cancelRefund: cancelMutation.mutateAsync,
    isPaying: payMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isLoading: payMutation.isPending || cancelMutation.isPending,
  };
}
