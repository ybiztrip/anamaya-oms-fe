import { Button, Card, Col, Row, Tag } from 'antd';

import useTrainStation from '@/hooks/useTrainStation';
import type { TrainJourneyType, TrainSegmentType } from '@/types';
import { formatIDR } from '@/utils/formatter';

function TrainInfo({
  train,
  segment: segmentProp,
  withTrainClass = true,
  withPrice = true,
  withSelect = true,
  onSelect,
}: Readonly<{
  train: TrainJourneyType;
  segment?: TrainSegmentType;
  withTrainClass?: boolean;
  withPrice?: boolean;
  withSelect?: boolean;
  onSelect?: (train: TrainJourneyType, segment: TrainSegmentType) => void;
}>) {
  const { stationsByCode } = useTrainStation();

  const segment = segmentProp ?? train.segments?.find((s) => s.active) ?? train.segments?.[0];
  const originStation = stationsByCode[train.origin];
  const destinationStation = stationsByCode[train.destination];
  const trainClassLabel = segment?.className ?? '-';
  const trainSubClassLabel = segment?.subClass ?? '-';
  const trainCode = train.carrierNumber ?? '';
  const price = Number(segment?.fare ?? 0);
  const availableSeats = Number(segment?.seat ?? 0);
  const isSoldOut = availableSeats <= 0;

  return (
    <Card
      key={`${train.journeyCode}-${segment?.classKey ?? ''}`}
      size="small"
      className={isSoldOut ? 'text-gray-400 [&_*]:text-gray-400' : undefined}
    >
      <Row align="middle" gutter={16} wrap={false}>
        <Col flex="220px">
          <div className="min-w-0">
            <div className="font-medium">
              {train.trainName} ({trainCode})
            </div>
            {withTrainClass && (
              <div className="text-sm text-gray-500">
                {trainClassLabel} ({trainSubClassLabel})
              </div>
            )}
          </div>
        </Col>

        <Col flex="auto">
          <div className="grid grid-cols-[4rem_auto_4rem] items-center justify-stretch">
            <div>
              <div className="text-lg font-semibold">{train.departureTime ?? '-'}</div>
              <div className="text-xs text-gray-500">
                {originStation?.stationName} ({train.origin})
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm">{train.duration ?? '-'}</div>
              <div className="border-t-4 border-gray-200 my-2" />
              <div className="text-xs text-gray-500">Direct</div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold">{train.arrivalTime ?? '-'}</div>
              <div className="text-xs text-gray-500">
                {train.destination ?? '-'}
                {destinationStation?.stationName ? ` · ${destinationStation.stationName}` : ''}
              </div>
            </div>
          </div>
        </Col>

        {withPrice && (
          <Col flex="auto" className="text-center">
            <div className="text-lg font-semibold">IDR {formatIDR(price)}</div>
            <Tag color={availableSeats > 0 ? 'green' : ''}>{availableSeats} seats left</Tag>
          </Col>
        )}
        {withSelect && segment && (
          <Col
            flex="100px"
            className="text-right self-stretch sticky right-0 bg-white flex items-center justify-end"
          >
            {isSoldOut ? (
              <span className="mt-2 font-medium px-2">Sold out</span>
            ) : (
              <Button type="primary" className="mt-2" onClick={() => onSelect?.(train, segment)}>
                Select
              </Button>
            )}
          </Col>
        )}
      </Row>
    </Card>
  );
}

export default TrainInfo;
