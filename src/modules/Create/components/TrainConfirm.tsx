import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Form, type FormInstance, Modal, Select, Space, Spin, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { INFANT_TYPE } from '@/constants/common';
import type {
  BookingParamsType,
  BookingPriceItemType,
  PassengerGuestType,
  TrainJourneyType,
  TrainSeatCellType,
} from '@/types';

import useTrainSeat from '../hooks/useTrainSeat';
import TrainInfo from './TrainInfo';

const SEAT_STATUS_AVAILABLE = 0;
const SEAT_STATUS_OCCUPIED = 1;
const SEAT_STATUS_AISLE = -1;

type SelectedTrainSeat = {
  seatId: string;
  coachName: string;
  seatNumber: string;
};

function formatSeatLabel(seat?: SelectedTrainSeat | null) {
  if (!seat?.coachName || !seat?.seatNumber) return 'No seat';
  return `${seat.coachName} · ${seat.seatNumber}`;
}

function SeatButton({
  seat,
  isSelectedByActivePax,
  isSelectedByOther,
  onSelect,
}: Readonly<{
  seat: TrainSeatCellType;
  isSelectedByActivePax: boolean;
  isSelectedByOther: boolean;
  onSelect: (seatId: string) => void;
}>) {
  if (seat.seatStatus === SEAT_STATUS_AISLE || !seat.seatNumber) {
    return <div style={{ width: 44, height: 24 }} />;
  }

  const isOccupied = seat.seatStatus === SEAT_STATUS_OCCUPIED;
  const disabled = (isOccupied && !isSelectedByActivePax) || isSelectedByOther;

  let buttonType: 'primary' | 'default' | 'dashed' = 'dashed';
  if (isSelectedByActivePax) buttonType = 'primary';
  else if (isSelectedByOther) buttonType = 'default';

  let backgroundColor: string | undefined;
  if (disabled && !isSelectedByOther) backgroundColor = '#d9d9d9';
  else if (isSelectedByOther) backgroundColor = '#e6f4ff';

  return (
    <Button
      size="small"
      disabled={disabled}
      type={buttonType}
      onClick={() => onSelect(seat.seatId)}
      style={{ width: 44, backgroundColor }}
    >
      {seat.seatNumber}
    </Button>
  );
}

function TrainConfirm({
  form,
  index,
  train,
  bookingParams,
  onPriceListChange,
}: Readonly<{
  form: FormInstance;
  index: number;
  train: TrainJourneyType;
  bookingParams: BookingParamsType;
  onPriceListChange?: (prices: BookingPriceItemType[], trainIndex: number) => void;
}>) {
  const [seatModalPaxIndex, setSeatModalPaxIndex] = useState<number | null>(null);
  const [draftSeat, setDraftSeat] = useState<SelectedTrainSeat | undefined>();
  const [activeCoachIndex, setActiveCoachIndex] = useState(0);

  const activeSegment = train.segments?.find((segment) => segment.active) ?? train.segments?.[0];
  const trainParams = bookingParams.trains?.[index];
  const { seatsMap: coaches, isLoading: isSeatsLoading } = useTrainSeat({
    bookingId: bookingParams.bookingId,
    trainId: trainParams?.trainId,
  });
  const isSeatSelectionReady =
    Boolean(bookingParams.bookingId) && Boolean(trainParams?.trainId) && !isSeatsLoading;
  const seatValues = Form.useWatch(['trains', `train-${index}`, 'paxs'], form);

  const selectedSeatByPax = useMemo(() => {
    const map = new Map<string, number>();
    bookingParams.paxList.forEach((_, paxIndex) => {
      const seat = seatValues?.[`pax-${paxIndex}`]?.seat as SelectedTrainSeat | undefined;
      if (seat?.seatId) map.set(seat.seatId, paxIndex);
    });
    return map;
  }, [bookingParams.paxList, seatValues]);

  const priceList = useMemo<BookingPriceItemType[]>(() => {
    const prices: BookingPriceItemType[] = [];
    const trainName = bookingParams.trains?.[index]?.name ?? train.trainName ?? 'Train';
    const fareAmount = Number(activeSegment?.fare ?? 0);
    const currency = 'IDR';

    let totalAdult = 0;
    bookingParams.paxList.forEach((pax: PassengerGuestType) => {
      if (pax?.type !== INFANT_TYPE) totalAdult += 1;
    });

    if (totalAdult > 0) {
      prices.push({
        item: `Train ${trainName} (Adult) x${totalAdult}`,
        currency,
        amount: fareAmount * totalAdult,
      });
    }

    return prices;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSegment?.fare, train.trainName]);

  useEffect(() => {
    onPriceListChange?.(priceList, index);
  }, [priceList, index, onPriceListChange]);

  const findCoachIndexBySeatId = (seatId?: string) => {
    if (!seatId) return 0;
    const found = coaches.findIndex((coach) =>
      coach.seatRows.some((row) => row.some((cell) => cell.seatId === seatId)),
    );
    return found >= 0 ? found : 0;
  };

  const openSeatModal = (paxIndex: number) => {
    const currentSeat = seatValues?.[`pax-${paxIndex}`]?.seat as SelectedTrainSeat | undefined;
    setDraftSeat(currentSeat);
    setActiveCoachIndex(findCoachIndexBySeatId(currentSeat?.seatId));
    setSeatModalPaxIndex(paxIndex);
  };

  const closeSeatModal = () => {
    setSeatModalPaxIndex(null);
    setDraftSeat(undefined);
  };

  const handleSelectSeat = (seatId: string) => {
    if (seatModalPaxIndex === null || !seatId) return;

    const takenByOther = selectedSeatByPax.get(seatId);
    if (takenByOther !== undefined && takenByOther !== seatModalPaxIndex) return;

    const activeCoach = coaches[activeCoachIndex];
    const seat = activeCoach?.seatRows.flat().find((cell) => cell.seatId === seatId);
    if (!seat?.seatNumber || seat.seatStatus === SEAT_STATUS_AISLE) return;
    if (seat.seatStatus === SEAT_STATUS_OCCUPIED && takenByOther === undefined) return;

    setDraftSeat({
      seatId,
      coachName: activeCoach.coachName,
      seatNumber: seat.seatNumber,
    });
  };

  const handleSaveSeat = () => {
    if (seatModalPaxIndex === null || !draftSeat) return;

    form.setFieldValue(
      ['trains', `train-${index}`, 'paxs', `pax-${seatModalPaxIndex}`, 'seat'],
      draftSeat,
    );
    closeSeatModal();
  };

  const activeCoach = coaches[activeCoachIndex];

  const coachOptions = useMemo(
    () =>
      coaches.map((coach, coachIndex) => {
        const availableCount = coach.seatRows
          .flat()
          .filter((cell) => cell.seatStatus === SEAT_STATUS_AVAILABLE).length;
        return {
          label: `${coach.coachName} (${availableCount} seats available)`,
          value: coachIndex,
        };
      }),
    [coaches],
  );

  const goToPrevCoach = () => {
    setActiveCoachIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToNextCoach = () => {
    setActiveCoachIndex((prev) => (prev < coaches.length - 1 ? prev + 1 : prev));
  };

  const trainClassLabel = activeSegment?.className ?? '-';
  const activePax =
    seatModalPaxIndex !== null ? bookingParams.paxList[seatModalPaxIndex] : undefined;

  return (
    <Space direction="vertical" className="w-full" size="middle">
      <TrainInfo train={train} withSelect={false} withPrice={false} />

      <Card size="small">
        <div className="text-lg font-semibold mb-2">Passengers</div>
        <Spin spinning={!isSeatSelectionReady} tip="Preparing seats…">
          <Space direction="vertical" className="w-full">
            {bookingParams.paxList.map((pax, paxIndex) => {
              const selectedSeat = seatValues?.[`pax-${paxIndex}`]?.seat as
                | SelectedTrainSeat
                | undefined;
              return (
                <Card key={pax.id} size="small">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-medium font-semibold">
                      {`${pax.firstName} ${pax.lastName}`}
                      {pax.type ? ` (${pax.type})` : ''}
                    </div>
                    <div className="flex items-center gap-2">
                      <Form.Item
                        name={['trains', `train-${index}`, 'paxs', `pax-${paxIndex}`, 'seat']}
                        noStyle
                      />
                      <Tag color={selectedSeat ? 'blue' : 'default'} className="m-0 px-3 py-1">
                        {formatSeatLabel(selectedSeat)}
                      </Tag>
                      <Button
                        type="link"
                        disabled={!isSeatSelectionReady}
                        onClick={() => openSeatModal(paxIndex)}
                      >
                        {selectedSeat ? 'Change Seat' : 'Select Seat'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </Space>
        </Spin>
      </Card>

      <Modal
        title={
          activePax ? `Select Seat — ${activePax.firstName} ${activePax.lastName}` : 'Select Seat'
        }
        open={seatModalPaxIndex !== null}
        onCancel={closeSeatModal}
        destroyOnHidden
        width={520}
        footer={[
          <Button key="cancel" onClick={closeSeatModal}>
            Cancel
          </Button>,
          <Button key="save" type="primary" disabled={!draftSeat} onClick={handleSaveSeat}>
            Save
          </Button>,
        ]}
      >
        <div className="text-xs text-gray-500 mb-3">
          Selected: {formatSeatLabel(draftSeat)} · Class: {trainClassLabel}
        </div>

        <div className="mb-4">
          <Select
            className="w-full"
            options={coachOptions}
            value={activeCoachIndex}
            onChange={(value) => setActiveCoachIndex(Number(value))}
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-4 h-4 rounded border bg-white" /> Available
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-4 h-4 rounded bg-blue-500" /> Selected
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-4 h-4 rounded bg-gray-300" /> Occupied
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon={<LeftOutlined />}
            disabled={activeCoachIndex <= 0}
            onClick={goToPrevCoach}
            aria-label="Previous coach"
          />
          <div className="flex-1 space-y-2">
            {activeCoach?.seatRows.map((row, rowIndex) => (
              <div
                key={`${activeCoach.code}-row-${rowIndex}`}
                className="flex justify-center gap-1"
              >
                {row.map((seat, seatIndex) => {
                  const takenBy = selectedSeatByPax.get(seat.seatId);
                  return (
                    <SeatButton
                      key={seat.seatId || `${activeCoach.code}-${rowIndex}-${seatIndex}`}
                      seat={seat}
                      isSelectedByActivePax={draftSeat?.seatId === seat.seatId}
                      isSelectedByOther={
                        Boolean(seat.seatId) &&
                        takenBy !== undefined &&
                        takenBy !== seatModalPaxIndex
                      }
                      onSelect={handleSelectSeat}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <Button
            icon={<RightOutlined />}
            disabled={activeCoachIndex >= coaches.length - 1}
            onClick={goToNextCoach}
            aria-label="Next coach"
          />
        </div>
      </Modal>
    </Space>
  );
}

export default TrainConfirm;
