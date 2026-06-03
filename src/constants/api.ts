export const BASE_API = import.meta.env.VITE_ANAMAYA_BASE_API;

export const API_V1 = '/api/v1';

export const AUTH_API = API_V1 + '/auth';
export const AUTH_LOGIN_API = AUTH_API + '/login';

export const ROLES_API = API_V1 + '/roles';

export const USERS_API = API_V1 + '/users';
export const USERS_DETAIL_API = USERS_API + '/:id';
export const USERS_ROLES_API = USERS_DETAIL_API + '/roles';
export const USERS_UPDATE_PASSWORD_API = USERS_DETAIL_API + '/update-password';

export const COMPANY_CONFIGS_API = API_V1 + '/company-configs';

export const TRAVEL_POLICY_API = API_V1 + '/travel-policies';
export const TRAVEL_POLICY_BY_ID_API = TRAVEL_POLICY_API + '/:id';

export const ACTIVITY_LOGS_API = API_V1 + '/activity-logs';

export const FLIGHT_API = API_V1 + '/flight';
export const FLIGHT_AIRLINES_API = FLIGHT_API + '/airlines';
export const FLIGHT_AIRPORTS_API = FLIGHT_API + '/airports';
export const FLIGHT_SEARCH_ONE_WAY_API = FLIGHT_API + '/search/one-way';
export const FLIGHT_BOOKING_ADD_ONS_API = FLIGHT_API + '/booking/add-ons';

export const HOTEL_API = API_V1 + '/hotel';
export const HOTEL_GEO_LIST_API = HOTEL_API + '/geo/list';
export const HOTEL_DISCOVERY_API = HOTEL_API + '/discovery';
export const HOTEL_PROPERTY_DETAIL_API = HOTEL_API + '/property-detail';
export const HOTEL_ROOM_API = HOTEL_API + '/room';
export const HOTEL_ROOM_RATE_API = HOTEL_API + '/room-rate';

export const BOOKINGS_API = API_V1 + '/bookings';
export const BOOKINGS_DETAIL_API = BOOKINGS_API + '/:id';
export const BOOKINGS_MY_APPROVAL_API = BOOKINGS_API + '/my-approved';
export const BOOKINGS_NEED_APPROVAL_API = BOOKINGS_API + '/need-approval';
export const BOOKINGS_FLIGHT_API = BOOKINGS_API + '/:id/flights';
export const BOOKINGS_HOTEL_API = BOOKINGS_API + '/:id/hotels';
export const BOOKINGS_ATTACHMENT_API = BOOKINGS_API + '/:id/attachments';
export const BOOKINGS_APPROVE_API = BOOKINGS_API + '/approve/:id';
export const BOOKINGS_REJECT_API = BOOKINGS_API + '/reject/:id';
export const BOOKINGS_FLIGHTS_API = BOOKINGS_API + '/flights';
export const BOOKINGS_FLIGHTS_EXPORT_API = BOOKINGS_API + '/flights/export';
export const BOOKINGS_HOTELS_API = BOOKINGS_API + '/hotels';
export const BOOKINGS_HOTELS_EXPORT_API = BOOKINGS_API + '/hotels/export';

export const DOCUMENT_API = API_V1 + '/documents';
export const DOCUMENT_UPLOAD_API = DOCUMENT_API + '/upload';
export const DOCUMENT_URL_API = DOCUMENT_API + '/url';

export const FILES_API = API_V1 + '/files';
export const FILES_FETCH_API = FILES_API + '/fetch';

export const DEPOSIT_API = API_V1 + '/balances';
export const DEPOSIT_DETAIL_API = DEPOSIT_API + '/:code';
export const DEPOSIT_MONITORING_API = DEPOSIT_API + '/monitoring';
export const DEPOSIT_MONITORING_EXPORT_API = DEPOSIT_MONITORING_API + '/export';

export const CREDIT_API = API_V1 + '/company-credit';
export const CREDIT_INVOICES_API = CREDIT_API + '/invoices';
export const CREDIT_MONITORING_API = CREDIT_API + '/monitoring';

export const REFUNDS_API = API_V1 + '/refunds';
