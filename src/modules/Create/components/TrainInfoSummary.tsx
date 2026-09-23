import { ArrowRightOutlined } from '@ant-design/icons';

import { TRAIN_CLASS_LABELS } from '@/constants/common';
import type { TrainSearchType } from '@/types';

function TrainInfoSummary({ train }: Readonly<{ train: TrainSearchType }>) {
  const trainCode = `${train.trainNumber}${train.subclass ?? ''}`;
  const trainClassLabel =
    TRAIN_CLASS_LABELS[train.trainClass] ?? train.summary?.trainClass ?? train.trainClass;

  return (
    <div>
      <div className="flex items-center gap-3">
        <div>
          <div className="text-sm font-medium">
            {train.trainName} ({trainCode})
          </div>
          <div className="text-xs text-gray-500">{trainClassLabel}</div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-semibold">{train.departureTime ?? '-'}</div>
            <div className="text-xs">{train.originStationCode ?? '-'}</div>
          </div>

          <div className="text-center">
            <ArrowRightOutlined />
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold">{train.arrivalTime ?? '-'}</div>
            <div className="text-xs">{train.destinationStationCode ?? '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainInfoSummary;
