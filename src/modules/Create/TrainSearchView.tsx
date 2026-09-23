import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Layout from '@/components/Layout';
import { CREATE_BOOKING_CONFIRM_PATH, CREATE_PATH } from '@/constants/routePath';
import { BOOKING_PARAMS } from '@/constants/storageKey';
import type { BookingParamsType, TrainSearchType } from '@/types';
import dayjs from '@/utils/dayjs';
import { sessionStorageGet, sessionStorageSet } from '@/utils/sessionStorage';

import TrainInfoSummary from './components/TrainInfoSummary';
import TrainSearchForm from './components/TrainSearchForm';

function TrainSearchView() {
  const navigate = useNavigate();

  const [bookingParams, setBookingParams] = useState<BookingParamsType | null>(() =>
    sessionStorageGet<BookingParamsType>(BOOKING_PARAMS),
  );
  const [activeTrainIndex, setActiveTrainIndex] = useState<number>(0);

  const updateBookingParams = useCallback((newBookingParams: BookingParamsType) => {
    sessionStorageSet<BookingParamsType>(BOOKING_PARAMS, newBookingParams);
    setBookingParams(newBookingParams);
  }, []);

  const syncSearchParams = useCallback(
    (formValues: any) => {
      const newTrains = [...(bookingParams?.trains ?? [])];
      newTrains[activeTrainIndex] = {
        ...newTrains[activeTrainIndex],
        origin: formValues.origin,
        destination: formValues.destination,
        departureDate: dayjs(formValues.departureDate, 'MM-DD-YYYY').format('YYYY-MM-DD'),
        trainClass: formValues.trainClass,
      };

      const newBookingParams = {
        ...bookingParams,
        trains: newTrains,
      } as BookingParamsType;
      updateBookingParams(newBookingParams);
    },
    [activeTrainIndex, bookingParams, updateBookingParams],
  );

  const selectTrain = useCallback(
    (train: TrainSearchType, trainIndex: number) => {
      const newTrains = [...(bookingParams?.trains ?? [])];
      newTrains[trainIndex] = {
        ...newTrains[trainIndex],
        // TODO
        // origin: train.origin,
        // destination: train.destination,
        // departureDate: dayjs(train.departureDate, 'MM-DD-YYYY').format('YYYY-MM-DD'),
        selectedTrain: train,
      };
      const newBookingParams = {
        ...bookingParams,
        trains: newTrains,
      } as BookingParamsType;
      updateBookingParams(newBookingParams);
      if (trainIndex === Number(bookingParams?.trains?.length ?? 0) - 1) {
        navigate(CREATE_BOOKING_CONFIRM_PATH);
      } else {
        setActiveTrainIndex(trainIndex + 1);
      }
    },
    [bookingParams, navigate, updateBookingParams],
  );

  useEffect(() => {
    if (!bookingParams) {
      navigate(CREATE_PATH);
    }
  }, [bookingParams, navigate]);

  return (
    <Layout withSidebar={false}>
      <Row>
        <Col flex="300px" className="pr-8">
          <Button
            className="mt-1"
            color="primary"
            variant="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(CREATE_PATH)}
          >
            Back
          </Button>
        </Col>
        <Col flex="auto">
          <Space.Compact>
            {bookingParams?.trains?.map((train, index) => {
              return (
                <Button
                  className="p-10"
                  key={train.name}
                  size="large"
                  disabled={index > Number(activeTrainIndex)}
                  onClick={() => setActiveTrainIndex(index)}
                  type={activeTrainIndex === index ? 'primary' : 'default'}
                >
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-center">
                      <div className="font-semibold">{train.name}</div>
                      <div>{`(${dayjs(train?.departureDate).format('DD MMM YYYY')})`}</div>
                    </div>
                    <div className="mt-2">
                      {train.selectedTrain && <TrainInfoSummary train={train.selectedTrain} />}
                    </div>
                  </div>
                </Button>
              );
            })}
          </Space.Compact>
        </Col>
      </Row>
      {bookingParams?.trains?.map((train, index) => {
        if (activeTrainIndex !== null && activeTrainIndex !== index) return null;
        return (
          <TrainSearchForm
            key={train.name}
            bookingParams={bookingParams}
            trainIndex={index}
            onSelectTrain={selectTrain}
            onSearchParamsChange={syncSearchParams}
          />
        );
      })}
    </Layout>
  );
}
export default TrainSearchView;
