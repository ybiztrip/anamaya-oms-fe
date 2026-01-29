export const BASE_API = import.meta.env.VITE_ANAMAYA_BASE_API;

export const API_V1 = '/api/v1';

export const AUTH_API = API_V1 + '/auth';
export const AUTH_LOGIN_API = AUTH_API + '/login';

export const USERS_API = API_V1 + '/users';

export const FLIGHT_API = API_V1 + '/flight';
export const FLIGHT_AIRPORTS_API = FLIGHT_API + '/airports';
export const FLIGHT_SEARCH_ONE_WAY_API = FLIGHT_API + '/search/one-way';