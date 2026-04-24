import { Button, Card, Col, Form, Input, message, Modal, Row } from 'antd';
import { useState } from 'react';

import Layout from '@/components/Layout';
import SectionCard from '@/components/SectionCard';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/common';
import type { UserRolesUpsertPayloadType, UserType } from '@/types';
import dayjs from '@/utils/dayjs';
import { getPhoneParts } from '@/utils/phone';

import EmployeeForm, {
  CreateEmployeeFields,
  UpdateEmployeeFields,
} from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import useEmployee from './hooks/useEmployee';

type ModalMode = 'create' | 'update';

const buildPaxFromUser = (user?: UserType) => {
  const { phoneCode, phoneNumber } = getPhoneParts(user?.phoneNo, user?.countryCode);
  return {
    id: user?.id ?? 0,
    status: user?.status ?? 1,
    roles: user?.roles?.map((r) => r.roleId) ?? [],
    email: user?.email ?? '',
    title: user?.title ?? 'MR',
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phoneNumber: phoneNumber ?? '',
    phoneCode: phoneCode ?? '+62',
    dob: user?.dateOfBirth ? dayjs(user.dateOfBirth, 'YYYY-MM-DD') : '',
    idNumber: user?.identityNo ?? '',
    passportNumber: user?.passportNo ?? '',
    passportExpiry: user?.passportExpiry ? dayjs(user.passportExpiry, 'YYYY-MM-DD') : '',
  };
};

export default function EmployeeView() {
  const {
    setEmailInput,
    page,
    pageSize,
    setPage,
    setPageSize,
    data,
    isLoading,
    error,
    buildUserPayload,
    buildRolesPayload,
    detailMutation,
    createMutation,
    updateMutation,
    rolesMutation,
    refreshEmployees,
  } = useEmployee();

  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const list = data?.data ?? [];
  const total = data?.totalElements ?? list.length;

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    form.setFieldsValue({
      ...buildPaxFromUser(),
    });
    setModalOpen(true);
  };

  const openEditModal = async (user: UserType) => {
    setModalMode('update');
    try {
      const res = await detailMutation.mutateAsync(user.id);
      if (!res.success) {
        message.error(res.message ?? DEFAULT_ERROR_MESSAGE);
        return;
      }
      const freshUser = res.data ?? user;
      setSelectedUser(freshUser);
      form.setFieldsValue({
        ...buildPaxFromUser(freshUser),
      });
      setModalOpen(true);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? err?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = buildUserPayload(values, selectedUser ?? undefined);
      const selectedRoles = (values.roles ?? []) as number[];

      let userId = selectedUser?.id;
      if (modalMode === 'create') {
        const created = await createMutation.mutateAsync(payload);
        userId = created?.data?.id;
      } else if (selectedUser) {
        await updateMutation.mutateAsync({ id: selectedUser.id, values: payload });
        userId = selectedUser.id;
      }

      if (userId) {
        const rolesPayload: UserRolesUpsertPayloadType = buildRolesPayload(
          selectedRoles,
          selectedUser ?? undefined,
        );
        if (rolesPayload.length > 0) {
          await rolesMutation.mutateAsync({ id: userId, values: rolesPayload });
        }
      }

      await refreshEmployees();
      message.success(modalMode === 'create' ? 'Employee created' : 'Employee updated');
      setModalOpen(false);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? err?.message ?? DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <Layout>
      <SectionCard className="mt-4" title="Employees">
        <Card size="small" className="mt-[-8px] mb-4">
          <Row justify="space-between">
            <Col>
              <Input
                placeholder="Search by email"
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={openCreateModal}>
                Add Employee
              </Button>
            </Col>
          </Row>
        </Card>
        {error && (
          <div className="text-center text-sm text-red-500 mb-4">
            {error?.message ?? DEFAULT_ERROR_MESSAGE}
          </div>
        )}
        <EmployeeList
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
          title={modalMode === 'create' ? 'Add Employee' : 'Edit Employee'}
          onCancel={() => setModalOpen(false)}
          onOk={handleSubmit}
          okText={modalMode === 'create' ? 'Create' : 'Update'}
          confirmLoading={
            createMutation.isPending || updateMutation.isPending || rolesMutation.isPending
          }
          width={900}
        >
          <Form form={form} layout="vertical" className="mt-4">
            <EmployeeForm
              fields={selectedUser ? UpdateEmployeeFields : CreateEmployeeFields}
              disabledFields={selectedUser ? ['email'] : []}
            />
          </Form>
        </Modal>
      </SectionCard>
    </Layout>
  );
}
