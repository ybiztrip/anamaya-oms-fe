import { Route, Routes } from 'react-router-dom';

import { PERMISSIONS } from '@/constants/permission';
import {
  APPROVAL_DETAIL_PATH,
  APPROVAL_PATH,
  CONFIGURATION_COMPANY_PATH,
  CONFIGURATION_EMPLOYEES_PATH,
  CONFIGURATION_TRAVEL_POLICIES_PATH,
  CREATE_BOOKING_CONFIRM_PATH,
  CREATE_FLIGHT_SEARCH_PATH,
  CREATE_HOTEL_ROOM_PATH,
  CREATE_HOTEL_SEARCH_PATH,
  CREATE_PATH,
  HOME_PATH,
  LOGIN_PATH,
  MONITORING_CREDIT_PATH,
  MONITORING_DEPOSIT_PATH,
  PROFILE_PATH,
} from '@/constants/routePath';
import ApprovalView from '@/modules/Approval/ApprovalView';
import BookingDetailView from '@/modules/Approval/BookingDetailView';
import CompanyView from '@/modules/Company/CompanyView';
import BookingConfirmView from '@/modules/Create/BookingConfirmView';
import CreateView from '@/modules/Create/CreateView';
import FlightSearchView from '@/modules/Create/FlightSearchView';
import HotelRoomView from '@/modules/Create/HotelRoomView';
import HotelSearchView from '@/modules/Create/HotelSearchView';
import EmployeeView from '@/modules/Employee/EmployeeView';
import HomeView from '@/modules/Home/HomeView';
import LoginView from '@/modules/Login/LoginView';
import MonitoringDepositView from '@/modules/Monitoring/MonitoringDepositView';
import ProfileView from '@/modules/Profile/ProfileView';
import TravelPolicyView from '@/modules/TravelPolicy/TravelPolicyView';

import PermittedRoute from './PermittedRoute';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path={LOGIN_PATH} element={<LoginView />} />
      <Route
        path={HOME_PATH}
        element={
          <ProtectedRoute>
            <HomeView />
          </ProtectedRoute>
        }
      />
      <Route
        path={PROFILE_PATH}
        element={
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        }
      />
      <Route
        path={CREATE_PATH}
        element={
          <ProtectedRoute>
            <CreateView />
          </ProtectedRoute>
        }
      />
      <Route
        path={CREATE_FLIGHT_SEARCH_PATH}
        element={
          <ProtectedRoute>
            <FlightSearchView />
          </ProtectedRoute>
        }
      />
      <Route
        path={CREATE_HOTEL_SEARCH_PATH}
        element={
          <ProtectedRoute>
            <HotelSearchView />
          </ProtectedRoute>
        }
      />
      <Route
        path={CREATE_HOTEL_ROOM_PATH}
        element={
          <ProtectedRoute>
            <HotelRoomView />
          </ProtectedRoute>
        }
      />
      <Route
        path={CREATE_BOOKING_CONFIRM_PATH}
        element={
          <ProtectedRoute>
            <BookingConfirmView />
          </ProtectedRoute>
        }
      />
      <Route
        path={APPROVAL_PATH}
        element={
          <ProtectedRoute>
            <ApprovalView />
          </ProtectedRoute>
        }
      />
      <Route
        path={APPROVAL_DETAIL_PATH}
        element={
          <ProtectedRoute>
            <BookingDetailView />
          </ProtectedRoute>
        }
      />
      <Route
        path={CONFIGURATION_EMPLOYEES_PATH}
        element={
          <ProtectedRoute>
            <PermittedRoute permission={PERMISSIONS.CONFIG_EMPLOYEE}>
              <EmployeeView />
            </PermittedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={CONFIGURATION_TRAVEL_POLICIES_PATH}
        element={
          <ProtectedRoute>
            <PermittedRoute permission={PERMISSIONS.CONFIG_TRAVEL_POLICY}>
              <TravelPolicyView />
            </PermittedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={CONFIGURATION_COMPANY_PATH}
        element={
          <ProtectedRoute>
            <PermittedRoute permission={PERMISSIONS.CONFIG_COMPANY}>
              <CompanyView />
            </PermittedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={MONITORING_CREDIT_PATH}
        element={
          <ProtectedRoute>
            <MonitoringDepositView />
          </ProtectedRoute>
        }
      />
      <Route
        path={MONITORING_DEPOSIT_PATH}
        element={
          <ProtectedRoute>
            <MonitoringDepositView />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
