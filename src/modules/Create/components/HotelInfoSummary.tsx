import { StarFilled } from '@ant-design/icons';

import type { HotelPropertyType } from '@/types';

function HotelInfoSummary({ hotel }: { hotel: HotelPropertyType }) {
  const summary = hotel.propertySummary;
  const starCount = Number(summary?.starRating ?? 0);

  return (
    <div>
      <div className="flex items-center gap-3">
        <div>
          <div className="text-sm font-medium">{summary?.name ?? '-'} </div>
          {starCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              {Array.from({ length: starCount }).map((_, i) => (
                <StarFilled key={i} style={{ color: '#69A8FF', fontSize: 12 }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HotelInfoSummary;
