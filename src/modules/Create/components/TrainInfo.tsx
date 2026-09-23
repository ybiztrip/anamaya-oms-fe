import { Button, Card, Col, Row } from 'antd';

import { TRAIN_CLASS_LABELS } from '@/constants/common';
import useTrainStation from '@/hooks/useTrainStation';
import type { TrainSearchType } from '@/types';
import { formatDuration, formatIDR } from '@/utils/formatter';

function TrainInfo({
  train,
  withTrainClass = true,
  withPrice = true,
  withSelect = true,
  onSelect,
}: Readonly<{
  train: TrainSearchType;
  withTrainClass?: boolean;
  withPrice?: boolean;
  withSelect?: boolean;
  onSelect?: (train: TrainSearchType) => void;
}>) {
  const { stationsByCode } = useTrainStation();

  const originStation = stationsByCode[train.originStationCode];
  const destinationStation = stationsByCode[train.destinationStationCode];
  const trainClassLabel = TRAIN_CLASS_LABELS[train.trainClass] ?? train.trainClass;
  const trainCode = `${train.trainNumber}${train.subclass ?? ''}`;
  const price = Number(train.fare?.amount ?? 0);
  const currency = train.fare?.currency ?? 'IDR';

  return (
    <Card key={train.trainId} size="small">
      <Row align="middle" gutter={16} wrap={false}>
        <Col flex="220px">
          <div className="min-w-0">
            <div className="font-medium">
              {train.trainName} ({trainCode})
            </div>
            {withTrainClass && <div className="text-sm text-gray-500">{trainClassLabel}</div>}
          </div>
        </Col>

        <Col flex="auto">
          <div className="grid grid-cols-[4rem_auto_4rem] items-center justify-stretch">
            <div>
              <div className="text-lg font-semibold">{train.departureTime ?? '-'}</div>
              <div className="text-xs text-gray-500">
                {train.originStationCode ?? '-'}
                {originStation?.stationName ? ` · ${originStation.stationName}` : ''}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm">{formatDuration(String(train.durationInMinutes))}</div>
              <div className="border-t-4 border-gray-200 my-2" />
              <div className="text-xs text-gray-500">Direct</div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold">{train.arrivalTime ?? '-'}</div>
              <div className="text-xs text-gray-500">
                {train.destinationStationCode ?? '-'}
                {destinationStation?.stationName ? ` · ${destinationStation.stationName}` : ''}
              </div>
            </div>
          </div>
        </Col>

        {withPrice && (
          <Col flex="auto" className="text-center">
            <div className="text-lg font-semibold">
              {currency} {formatIDR(price)}
            </div>
            <div className="text-xs text-gray-500 mt-1">{train.availableSeats} seats left</div>
          </Col>
        )}
        {withSelect && (
          <Col
            flex="100px"
            className="text-right self-stretch sticky right-0 bg-white flex items-center justify-end"
          >
            <Button type="primary" className="mt-2" onClick={() => onSelect?.(train)}>
              Select
            </Button>
          </Col>
        )}
      </Row>
    </Card>
  );
}

export default TrainInfo;
