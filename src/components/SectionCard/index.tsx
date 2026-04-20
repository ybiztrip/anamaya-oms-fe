import { Card, type CardProps } from 'antd';

export default function SectionCard({ ...props }: CardProps) {
  return (
    <Card
      style={{
        border: 'none',
        boxShadow: 'none',
        ...props.style,
      }}
      styles={{
        header: {
          margin: '0 auto -24px auto',
          width: 'fit-content',
          borderRadius: 24,
          border: '1px #8BB9FF solid',
          backgroundColor: 'white',
          zIndex: 10,
          position: 'relative',
        },
        body: {
          border: '1px #8BB9FF solid',
          borderRadius: 24,
          ...(props.title ? { paddingTop: 40 } : {}),
          backgroundColor: '#fff',
          zIndex: 1,
          position: 'relative',
        },
        ...props.styles,
      }}
      {...props}
    />
  );
}
