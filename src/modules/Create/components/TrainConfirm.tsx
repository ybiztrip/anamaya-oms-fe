import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Form, type FormInstance, Input, Modal, Select, Space, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { mockFetchTrainSeats } from '@/api/mock';
import { ADULT_TYPE, CHILD_TYPE } from '@/constants/common';
import type {
  BookingParamsType,
  BookingPriceItemType,
  PassengerGuestType,
  TrainCoachType,
  TrainJourneyType,
  TrainSeatCellType,
} from '@/types';

import TrainInfo from './TrainInfo';

const SEAT_STATUS_AVAILABLE = 0;
const SEAT_STATUS_OCCUPIED = 1;
const SEAT_STATUS_AISLE = -1;

function formatSeatLabel(seatId: string | undefined, coaches: TrainCoachType[]) {
  if (!seatId) return 'No seat';
  for (const coach of coaches) {
    for (const row of coach.seatRows) {
      const seat = row.find((cell) => cell.seatId === seatId);
      if (seat) return `${coach.coachName} · ${seat.seatNumber}`;
    }
  }
  return seatId;
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
  const [draftSeat, setDraftSeat] = useState<string | undefined>();
  const [activeCoachIndex, setActiveCoachIndex] = useState(0);

  const activeSegment = train.segments?.find((segment) => segment.active) ?? train.segments?.[0];
  const coaches = useMemo(() => mockFetchTrainSeats.data.seatsMap ?? [], []);
  const seatValues = Form.useWatch(['trains', `train-${index}`, 'paxs'], form);

  const selectedSeatByPax = useMemo(() => {
    const map = new Map<string, number>();
    bookingParams.paxList.forEach((_, paxIndex) => {
      const seat = seatValues?.[`pax-${paxIndex}`]?.seat as string | undefined;
      if (seat) map.set(seat, paxIndex);
    });
    return map;
  }, [bookingParams.paxList, seatValues]);

  const priceList = useMemo<BookingPriceItemType[]>(() => {
    const prices: BookingPriceItemType[] = [];
    const trainName = bookingParams.trains?.[index]?.name ?? train.trainName ?? 'Train';
    const fareAmount = Number(activeSegment?.fare ?? 0);
    const currency = 'IDR';

    let totalAdult = 0;
    let totalChild = 0;
    let totalInfant = 0;
    bookingParams.paxList.forEach((pax: PassengerGuestType) => {
      if (pax?.type === ADULT_TYPE) totalAdult += 1;
      else if (pax?.type === CHILD_TYPE) totalChild += 1;
      else totalInfant += 1;
    });

    if (totalAdult > 0) {
      prices.push({
        item: `Train ${trainName} (Adult) x${totalAdult}`,
        currency,
        amount: fareAmount * totalAdult,
      });
    }
    if (totalChild > 0) {
      prices.push({
        item: `Train ${trainName} (Child) x${totalChild}`,
        currency,
        amount: fareAmount * totalChild,
      });
    }
    if (totalInfant > 0) {
      prices.push({
        item: `Train ${trainName} (Infant) x${totalInfant}`,
        currency,
        amount: fareAmount * totalInfant,
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
    const currentSeat = seatValues?.[`pax-${paxIndex}`]?.seat as string | undefined;
    setDraftSeat(currentSeat);
    setActiveCoachIndex(findCoachIndexBySeatId(currentSeat));
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
    if (!seat || seat.seatStatus === SEAT_STATUS_AISLE) return;
    if (seat.seatStatus === SEAT_STATUS_OCCUPIED && takenByOther === undefined) return;

    setDraftSeat(seatId);
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
          label: `${coach.coachName} (${availableCount})`,
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
        <Space direction="vertical" className="w-full">
          {bookingParams.paxList.map((pax, paxIndex) => {
            const selectedSeat = seatValues?.[`pax-${paxIndex}`]?.seat as string | undefined;
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
                      rules={[{ required: true, message: 'Seat required' }]}
                      className="mb-0"
                    >
                      <Input type="hidden" />
                    </Form.Item>
                    <Tag color={selectedSeat ? 'blue' : 'default'} className="m-0 px-3 py-1">
                      {formatSeatLabel(selectedSeat, coaches)}
                    </Tag>
                    <Button type="link" onClick={() => openSeatModal(paxIndex)}>
                      {selectedSeat ? 'Change Seat' : 'Select Seat'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </Space>
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
            Simpan
          </Button>,
        ]}
      >
        <div className="text-xs text-gray-500 mb-3">
          Selected: {formatSeatLabel(draftSeat, coaches)} · Class: {trainClassLabel}
        </div>

        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Gerbong</div>
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
                      isSelectedByActivePax={draftSeat === seat.seatId}
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
