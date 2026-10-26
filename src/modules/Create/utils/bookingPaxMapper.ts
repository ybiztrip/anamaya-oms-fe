import type { PassengerGuestType } from '@/types';

export function getBookingPaxPayload(pax: PassengerGuestType) {
  return {
    firstName: pax.firstName,
    lastName: pax.lastName,
    title: pax.title ?? 'MR',
    gender: pax.title === 'MR' ? 'MALE' : 'FEMALE',
    type: pax.type ?? 'ADULT',
    email: pax.email,
    nationality: 'ID',
    phoneCode: pax.phoneCode ?? '',
    phoneNumber: `${pax.phoneCode ?? ''}${pax.phoneNumber ?? ''}`,
    dob: pax.dob,
    issuingCountry: 'ID',
    documentType: 'PASSPORT',
    documentNo: pax.passportNumber,
    expirationDate: pax.passportExpiry,
    issuedDate: pax.passportIssued,
  };
}
