import {
  Button,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import SectionCard from '@/components/SectionCard';
import SelectHotelGeo from '@/components/Select/SelectHotelGeo';
import { DEFAULT_PAGE_SIZE } from '@/constants/common';
import useTravelPolicy from '@/hooks/useTravelPolicy';
import type { BookingParamsType, HotelPropertyType } from '@/types';
import dayjs from '@/utils/dayjs';
import getTravelPolicyLimits from '@/utils/travelPolicyLimits';

import useHotelSearch from '../hooks/useHotelSearch';
import HotelInfo from './HotelInfo';

function HotelSearchForm({
  bookingParams,
  onSelectHotel,
  onSearchParamsChange,
}: Readonly<{
  bookingParams: BookingParamsType;
  onSelectHotel: (hotel: HotelPropertyType, formValues: any) => void;
  onSearchParamsChange?: (formValues: any) => void;
}>) {
  const [form] = Form.useForm();
  const [items, setItems] = useState<HotelPropertyType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const lastSearchRef = useRef<any>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const checkInDate = Form.useWatch('checkInDate', form);
  const checkOutDate = Form.useWatch('checkOutDate', form);
  const nights = checkInDate && checkOutDate ? checkOutDate.diff(checkInDate, 'day') : 0;

  const { hotelParams, handleSearchHotels, isLoading } = useHotelSearch({
    bookingParams,
  });
  const { travelPoliciesById, isLoading: isTravelPolicyLoading } = useTravelPolicy();
  const isPolicyReady = !isTravelPolicyLoading;

  const autoSearchRef = useRef(false);

  const priceLimits = useMemo(() => {
    const policyLimits = getTravelPolicyLimits(bookingParams?.paxList, travelPoliciesById);
    if (!policyLimits) return null;
    return {
      minPrice: policyLimits.hotelMinPrice,
      maxPrice: policyLimits.hotelMaxPrice,
    };
  }, [bookingParams?.paxList, travelPoliciesById]);
  const minPriceBound = priceLimits?.minPrice ?? 0;
  const maxPriceBound =
    priceLimits && Number.isFinite(priceLimits.maxPrice) ? priceLimits.maxPrice : undefined;

  useEffect(() => {
    if (!priceLimits) return;

    const currentMin = form.getFieldValue('minPrice');
    const currentMax = form.getFieldValue('maxPrice');
    const nextMin =
      typeof currentMin === 'number'
        ? Math.max(currentMin, priceLimits.minPrice)
        : priceLimits.minPrice;
    const nextMax =
      typeof currentMax === 'number'
        ? Math.min(currentMax, priceLimits.maxPrice)
        : priceLimits.maxPrice;
    const normalizedMax = Math.max(nextMax, nextMin);

    if (nextMin !== currentMin || normalizedMax !== currentMax) {
      form.setFieldsValue({
        minPrice: nextMin,
        maxPrice: normalizedMax,
      });
    }
  }, [form, priceLimits]);

  useEffect(() => {
    if (autoSearchRef.current) return;
    if (!isPolicyReady) return;
    if (!priceLimits) return;

    if (hotelParams?.destinationGeo && hotelParams?.checkInDate && hotelParams?.checkOutDate) {
      const currentMin = form.getFieldValue('minPrice');
      const currentMax = form.getFieldValue('maxPrice');
      const nextMin =
        typeof currentMin === 'number'
          ? Math.max(currentMin, priceLimits.minPrice)
          : priceLimits.minPrice;
      const nextMax =
        typeof currentMax === 'number'
          ? Math.min(currentMax, priceLimits.maxPrice)
          : priceLimits.maxPrice;
      const normalizedMax = Math.max(nextMax, nextMin);

      if (nextMin !== currentMin || normalizedMax !== currentMax) {
        form.setFieldsValue({
          minPrice: nextMin,
          maxPrice: normalizedMax,
        });
      }
      form.submit();
    }
  }, [hotelParams, form, isPolicyReady, priceLimits]);

  const runSearch = useCallback(
    async (values: any, nextPage: number, append: boolean) => {
      const response = await handleSearchHotels({
        ...values,
        page: nextPage,
        limit: DEFAULT_PAGE_SIZE,
      });
      const { properties = [], totalPages = 1 } = response?.data ?? {};
      setItems((prev) => (append ? [...prev, ...properties] : properties));
      setPage(nextPage);
      setTotalPages(Number(totalPages));
      return properties.length;
    },
    [handleSearchHotels],
  );

  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore) return;
    if (!lastSearchRef.current) return;
    if (page >= totalPages) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      await runSearch(lastSearchRef.current, nextPage, true);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, page, totalPages, runSearch]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    if (page >= totalPages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { root: null, rootMargin: '300px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, page, totalPages]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...hotelParams,
        destination: hotelParams?.destinationGeo
          ? { value: hotelParams?.destinationGeo, label: hotelParams?.destinationName }
          : undefined,
        checkInDate: hotelParams?.checkInDate ? dayjs(hotelParams.checkInDate) : undefined,
        checkOutDate: hotelParams?.checkOutDate ? dayjs(hotelParams.checkOutDate) : undefined,
        sortBy: 'HIGHEST_PRICE',
      }}
      onFinish={async (values) => {
        autoSearchRef.current = true;
        onSearchParamsChange?.(values);
        lastSearchRef.current = values;
        setIsLoadingMore(false);
        setHasSearched(true);
        await runSearch(values, 1, false);
      }}
    >
      <div className="sticky top-0 z-10 bg-white pb-3">
        <Row>
          <Col flex="300px"></Col>
          <Col flex="auto">
            <SectionCard className="mt-4">
              <Row gutter={[16, 8]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="destination"
                    label="Destination"
                    layout="vertical"
                    style={{ flex: 1, marginBottom: 0 }}
                    rules={[{ required: true, message: 'Destination required' }]}
                  >
                    <SelectHotelGeo placeholder="Location" labelInValue />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    name="checkInDate"
                    label="Check in"
                    layout="vertical"
                    rules={[{ required: true, message: 'Check in required' }]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      disabledDate={(d) => d.isBefore(dayjs(), 'day')}
                      format="DD MMM YYYY"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    name="checkOutDate"
                    label="Check out"
                    layout="vertical"
                    rules={[
                      { required: true, message: 'Check out required' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const checkIn = getFieldValue('checkInDate');
                          if (!value || !checkIn) return Promise.resolve();
                          if (value.isAfter(checkIn, 'day')) return Promise.resolve();
                          return Promise.reject(new Error('Check out must be after check in'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      disabledDate={(d) =>
                        checkInDate
                          ? d.isBefore(checkInDate.add(1, 'day'), 'day')
                          : d.isBefore(dayjs().add(1, 'day'), 'day')
                      }
                      format="DD MMM YYYY"
                    />
                  </Form.Item>
                </Col>
                {checkInDate && checkOutDate && (
                  <Col xs={24} md={4}>
                    <div className="mt-8">{nights} nights</div>
                  </Col>
                )}

                <Col xs={24} md={4}>
                  <Button color="primary" variant="filled" htmlType="submit" block>
                    Search
                  </Button>
                </Col>
              </Row>
            </SectionCard>
          </Col>
        </Row>
      </div>
      <Row wrap={false}>
        <Col flex="300px" className="pr-8">
          <Form.Item className="mt-8" name="sortBy" label="Sort By">
            <Select
              placeholder="Sort By"
              options={[
                { label: 'Lowest Price', value: 'LOWEST_PRICE' },
                { label: 'Highest Price', value: 'HIGHEST_PRICE' },
              ]}
              style={{ width: 'fit-content' }}
            />
          </Form.Item>
          <Form.Item label="Price Range">
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* <Form.Item name="minPrice" noStyle initialValue={0}>
                <InputNumber min={0} placeholder="Min" style={{ width: '100%' }} />
              </Form.Item>
              <Typography.Text type="secondary">to</Typography.Text>
              <Form.Item name="maxPrice" noStyle initialValue={10000000}>
                <InputNumber min={0} placeholder="Max" style={{ width: '100%' }} />
              </Form.Item> */}
              <Form.Item
                name="minPrice"
                noStyle
                initialValue={0}
                rules={[
                  {
                    validator: (_, value) => {
                      if (value === undefined || value === null) return Promise.resolve();
                      if (value < minPriceBound) {
                        return Promise.reject(
                          new Error(
                            `Minimum price must be greater than or equal to ${minPriceBound}`,
                          ),
                        );
                      }
                      if (maxPriceBound !== undefined && value > maxPriceBound) {
                        return Promise.reject(
                          new Error(`Minimum price must be less than or equal to ${maxPriceBound}`),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  min={minPriceBound}
                  max={maxPriceBound}
                  placeholder="Min"
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Typography.Text type="secondary">to</Typography.Text>
              <Form.Item
                name="maxPrice"
                noStyle
                initialValue={10000000}
                rules={[
                  ({ getFieldValue }) => ({
                    validator: (_, value) => {
                      if (value === undefined || value === null) return Promise.resolve();
                      if (value < minPriceBound) {
                        return Promise.reject(
                          new Error(
                            `Maximum price must be greater than or equal to ${minPriceBound}`,
                          ),
                        );
                      }
                      if (maxPriceBound !== undefined && value > maxPriceBound) {
                        return Promise.reject(
                          new Error(`Maximum price must be less than or equal to ${maxPriceBound}`),
                        );
                      }
                      const minPrice = getFieldValue('minPrice');
                      if (typeof minPrice === 'number' && value < minPrice) {
                        return Promise.reject(
                          new Error('Maximum price must be greater than or equal to minimum price'),
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <InputNumber
                  min={minPriceBound}
                  max={maxPriceBound}
                  placeholder="Max"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Space>
          </Form.Item>
        </Col>
        <Col flex="auto">
          {isLoading && items.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <Spin />
            </div>
          ) : (
            <>
              {hasSearched && !isLoading && items.length === 0 && (
                <div className="flex justify-center items-center h-full">
                  <div className="text-gray-500">No hotels found</div>
                </div>
              )}
              {items.map((r: HotelPropertyType) => {
                return (
                  <div key={r.propertyId} className="overflow-x-auto">
                    <div style={{ minWidth: 800 }} className="mt-4 space-y-3">
                      <HotelInfo
                        hotel={r}
                        onSelect={() => onSelectHotel(r, form.getFieldsValue())}
                      />
                    </div>
                  </div>
                );
              })}
              {hasSearched && items.length > 0 && page < totalPages && (
                <div className="flex justify-center py-6 text-sm text-gray-500">
                  {isLoadingMore ? <Spin /> : 'Scroll to load more'}
                </div>
              )}
              <div ref={sentinelRef} />
            </>
          )}
        </Col>
      </Row>
    </Form>
  );
}

export default HotelSearchForm;
