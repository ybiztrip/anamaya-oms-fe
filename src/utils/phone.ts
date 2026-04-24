import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const getPhoneParts = (phone?: string, countryCode?: string) => {
  if (!phone) {
    return { phoneCode: countryCode ?? '+62', phoneNumber: '' };
  }
  const parsed = phone.startsWith('+') ? parsePhoneNumberFromString(phone) : undefined;
  const phoneCode =
    countryCode ?? (parsed?.countryCallingCode ? `+${parsed.countryCallingCode}` : '+62');
  let phoneNumber = parsed?.nationalNumber ?? phone;
  if (countryCode) {
    const rawCode = countryCode.replace('+', '');
    phoneNumber = phoneNumber.replace(countryCode, '').replace(rawCode, '').trim();
  }
  return { phoneCode, phoneNumber };
};
