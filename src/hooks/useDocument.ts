import { message } from 'antd';
import { useCallback, useState } from 'react';

import { documentUrl } from '@/api';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';

type DocumentUrlMap = Record<string, string>;

export default function useDocument() {
  const [documentUrls, setDocumentUrls] = useState<DocumentUrlMap>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const getDocumentUrl = useCallback(
    async (key: string) => {
      if (documentUrls[key]) {
        return documentUrls[key];
      }

      setLoadingKey(key);
      try {
        const response = await documentUrl(key);
        const url = response.data;
        setDocumentUrls((prev) => ({ ...prev, [key]: url }));
        return url;
      } catch (error) {
        message.error((error as Error)?.message ?? DEFAULT_ERROR_MESSAGE);
        return null;
      } finally {
        setLoadingKey((current) => (current === key ? null : current));
      }
    },
    [documentUrls],
  );

  return {
    documentUrls,
    loadingKey,
    getDocumentUrl,
  };
}
