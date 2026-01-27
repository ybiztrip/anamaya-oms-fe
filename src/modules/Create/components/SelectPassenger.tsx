import { Select, type SelectProps } from 'antd';

import usePassenger from '@/modules/Approval/hooks/usePassenger';

function SelectPassenger(props: SelectProps) {
  const { passengers, isLoading } = usePassenger();

  return (
    <Select
      loading={isLoading}
      options={passengers.map((passenger) => ({
        label: passenger.email,
        value: passenger.email,
        passenger,
      }))}
      style={{ width: '100%' }}
      {...props}
    />
  );
}
export default SelectPassenger;
