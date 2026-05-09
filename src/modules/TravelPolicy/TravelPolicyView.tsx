import { Button, Col, Form, message, Modal, Row, Typography } from 'antd';
import { useState } from 'react';

import ActivityLogs from '@/components/ActivityLogs';
import Layout from '@/components/Layout';
import SectionCard from '@/components/SectionCard';
import { AIRLINE_CODE_GARUDA, DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { TravelPolicyType } from '@/types';

import TravelPolicyForm from './components/TravelPolicyForm';
import TravelPolicyList from './components/TravelPolicyList';
import useTravelPolicy from './hooks/useTravelPolicy';

type ModalMode = 'create' | 'update';

const buildTravelPolicyFormValues = (travelPolicy?: TravelPolicyType) => {
  return {
    id: travelPolicy?.id ?? 0,
    status: travelPolicy?.status ?? 1,
    name: travelPolicy?.name ?? '',
    includingGarudaAirline:
      travelPolicy?.flights?.some((f) => f.name === AIRLINE_CODE_GARUDA && f.isActive) ?? false,
    flightMinimumPrice: travelPolicy?.flightMinimumPrice ?? 0,
    flightMaximumPrice: travelPolicy?.flightMaximumPrice ?? 0,
    flightMinimumClass: travelPolicy?.flightMinimumClass ?? '',
    flightMaximumClass: travelPolicy?.flightMaximumClass ?? '',
    hotelMinimumPrice: travelPolicy?.hotelMinimumPrice ?? 0,
    hotelMaximumPrice: travelPolicy?.hotelMaximumPrice ?? 0,
    hotelMinimumClass: travelPolicy?.hotelMinimumClass ?? '',
    hotelMaximumClass: travelPolicy?.hotelMaximumClass ?? '',
  };
};

export default function TravelPolicyView() {
  const {
    page,
    pageSize,
    setPage,
    setPageSize,
    data,
    isLoading,
    error,
    buildTravelPolicyPayload,
    createMutation,
    updateMutation,
    refreshTravelPolicies,
  } = useTravelPolicy();

  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedTravelPolicy, setSelectedTravelPolicy] = useState<TravelPolicyType | null>(null);

  const list = data?.data ?? [];
  const total = data?.totalElements ?? list.length;

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedTravelPolicy(null);
    form.setFieldsValue({
      ...buildTravelPolicyFormValues(),
    });
    setModalOpen(true);
  };

  const openEditModal = async (travelPolicy: TravelPolicyType) => {
    setModalMode('update');
    try {
      setSelectedTravelPolicy(travelPolicy);
      form.setFieldsValue({
        ...buildTravelPolicyFormValues(travelPolicy),
      });
      setModalOpen(true);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? err?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = buildTravelPolicyPayload(values, selectedTravelPolicy ?? undefined);

      if (modalMode === 'create') {
        await createMutation.mutateAsync(payload);
      } else if (selectedTravelPolicy) {
        await updateMutation.mutateAsync({ id: selectedTravelPolicy.id, values: payload });
      }
      await refreshTravelPolicies();
      message.success(modalMode === 'create' ? 'Travel policy created' : 'Travel policy updated');
      setModalOpen(false);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? err?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <Layout>
      <SectionCard className="mt-4" title="Travel Policies">
        <Row justify="end" className="mt-[-8px] mb-4">
          <Button type="primary" onClick={openCreateModal}>
            Add Travel Policy
          </Button>
        </Row>
        {error && (
          <div className="text-center text-sm text-red-500 mb-4">
            {error?.message ?? DEFAULT_ERROR_MESSAGE}
          </div>
        )}
        <TravelPolicyList
          data={list}
          loading={isLoading}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={(nextPage, nextSize) => {
            setPage(nextPage);
            if (nextSize !== pageSize) {
              setPageSize(nextSize);
            }
          }}
          onEdit={openEditModal}
        />

        <Modal
          open={modalOpen}
          title={modalMode === 'create' ? 'Add Travel Policy' : 'Edit Travel Policy'}
          onCancel={() => setModalOpen(false)}
          onOk={handleSubmit}
          okText={modalMode === 'create' ? 'Create' : 'Update'}
          confirmLoading={createMutation.isPending || updateMutation.isPending}
          width={1200}
        >
          <Row gutter={[32, 16]}>
            <Col span={16}>
              <Form form={form} layout="vertical" className="mt-4">
                <TravelPolicyForm mode={modalMode} />
              </Form>
            </Col>
            <Col span={8} className="border-l border-gray-200">
              <div className="mb-4 mt-4">
                <Typography.Title level={5}>Activity Logs</Typography.Title>
              </div>
              <ActivityLogs type="TRAVEL_POLICY" referenceId={selectedTravelPolicy?.id ?? 0} />
            </Col>
          </Row>
        </Modal>
      </SectionCard>
    </Layout>
  );
}
