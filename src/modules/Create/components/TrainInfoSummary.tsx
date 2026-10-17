import { ArrowRightOutlined } from '@ant-design/icons';

import type { TrainJourneyType } from '@/types';

function TrainInfoSummary({ train }: Readonly<{ train: TrainJourneyType }>) {
  const firstSegment = train.segments?.find((segment) => segment.active) ?? train.segments?.[0];
  const trainCode = train.carrierNumber ?? '';
  const trainClassLabel = firstSegment?.className ?? '-';
  const trainSubClassLabel = firstSegment?.subClass ?? '-';

  return (
    <div>
      <div className="flex items-center gap-3">
        <div>
          <div className="text-sm font-medium">
            {train.trainName} ({trainCode})
          </div>
          <div className="text-xs">{trainClassLabel} ({trainSubClassLabel})</div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-semibold">{train.departureTime ?? '-'}</div>
            <div className="text-xs">{train.origin ?? '-'}</div>
          </div>

          <div className="text-center">
            <ArrowRightOutlined />
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold">{train.arrivalTime ?? '-'}</div>
            <div className="text-xs">{train.destination ?? '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainInfoSummary;
