import { Select, type SelectProps } from 'antd';
import { type CountryCode, getCountries, getCountryCallingCode } from 'libphonenumber-js';
import { useMemo, useState } from 'react';

export type SelectPhoneCodeProps = Omit<SelectProps, 'options' | 'value' | 'onChange'> & {
  value?: string;
  onChange?: (value: string) => void;
};

function dialToCountry(dial?: string): CountryCode {
  const raw = (dial ?? '+62').replace('+', '');
  return getCountries().find((c) => getCountryCallingCode(c) === raw) ?? 'ID';
}

export default function SelectPhoneCode({ value, onChange, ...props }: SelectPhoneCodeProps) {
  const options = useMemo(
    () =>
      getCountries().map((country) => {
        const code = `+${getCountryCallingCode(country)}`;
        return { label: `${country} (${code})`, value: country };
      }),
    [],
  );

  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  const dialValue = value ?? '+62';
  const country =
    selectedCountry && `+${getCountryCallingCode(selectedCountry)}` === dialValue
      ? selectedCountry
      : dialToCountry(dialValue);

  return (
    <Select
      style={{ width: 130 }}
      showSearch={{ optionFilterProp: 'label' }}
      options={options}
      value={country}
      onChange={(next: CountryCode) => {
        setSelectedCountry(next);
        onChange?.(`+${getCountryCallingCode(next)}`);
      }}
      {...props}
    />
  );
}
