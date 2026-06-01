import { Button } from 'antd';

import useDocument from '@/hooks/useDocument';

type DocumentLinkItem = {
  file: string;
  name?: string;
};

type DocumentLinksProps = Readonly<{
  attachments?: DocumentLinkItem[];
  emptyText?: string;
}>;

export default function DocumentLinks({ attachments, emptyText = '-' }: DocumentLinksProps) {
  const { getDocumentUrl, loadingKey } = useDocument();

  if (!attachments || attachments.length === 0) {
    return <span>{emptyText}</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment, index) => (
        <Button
          key={`${attachment.file}-${index}`}
          type="link"
          size="small"
          loading={loadingKey === attachment.file}
          onClick={async () => {
            const url = await getDocumentUrl(attachment.file);
            if (url) {
              window.open(url, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {attachment.name ?? `Attachment ${index + 1}`}
        </Button>
      ))}
    </div>
  );
}
