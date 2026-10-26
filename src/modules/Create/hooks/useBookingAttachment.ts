import { useMutation } from '@tanstack/react-query';
import { message, type UploadFile } from 'antd';
import { useCallback } from 'react';

import { submitBookingsAttachment } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { BookingAttachmentPayloadType } from '@/types';

export default function useBookingAttachment() {
  const submitBookingsAttachmentMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BookingAttachmentPayloadType }) =>
      submitBookingsAttachment(id, payload),
    onError: (e: any) => {
      message.error(e?.response?.data?.message ?? DEFAULT_ERROR_MESSAGE);
    },
  });

  const submitAttachments = useCallback(
    async ({ bookingId, attachments }: { bookingId: string; attachments?: UploadFile[] }) => {
      if (!attachments?.length) return;

      return submitBookingsAttachmentMutation.mutateAsync({
        id: bookingId,
        payload: {
          files: attachments.map((attachment) => attachment.response ?? ''),
        },
      });
    },
    [submitBookingsAttachmentMutation],
  );

  return {
    submitAttachments,
    isLoading: submitBookingsAttachmentMutation.isPending,
  };
}
