import { Card } from 'antd';
import { useMemo } from 'react';

import { formatIDR } from '@/utils/formatter';

function PriceDetail({ prices }: { prices: { item: string; currency: string; amount: number }[] }) {
  const total = useMemo(() => {
    return prices.reduce((acc, price) => acc + Number(price.amount), 0);
  }, [prices]);
  return (
    <Card size="small">
      <div className="text-lg font-semibold border-b pb-2">Price detail</div>
      <div className="space-y-1 py-1">
        {prices.map((price, index) => (
          <div key={`price-${index}`} className="flex justify-between gap-6 text-medium py-1">
            <span>{price.item}</span>
            <span>{price.currency} {formatIDR(price.amount)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-2 flex justify-between gap-6">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-semibold">IDR {formatIDR(total)}</span>
      </div>
    </Card>
  );
}
export default PriceDetail;
