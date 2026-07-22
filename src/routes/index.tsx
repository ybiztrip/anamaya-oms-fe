import { Route, Routes } from 'react-router-dom';

import { PERMISSIONS } from '@/constants/permission';
import {
  APPROVAL_DETAIL_PATH,
  APPROVAL_PATH,
  CONFIGURATION_COMPANY_PATH,
  CONFIGURATION_EMPLOYEES_PATH,
  CONFIGURATION_TRAVEL_POLICIES_PATH,
  CREATE_BOOKING_CONFIRM_SEGMENT,
  CREATE_FLIGHT_SEARCH_SEGMENT,
  CREATE_HOTEL_ROOM_SEGMENT,
  CREATE_HOTEL_SEARCH_SEGMENT,
  CREATE_PATH,
  HOME_PATH,
  LOGIN_PATH,
  MONITORING_CREDIT_PATH,
  MONITORING_DEPOSIT_PATH,
  PROFILE_PATH,
  REPORT_FLIGHT_PATH,
  REPORT_HOTEL_PATH,
} from '@/constants/routePath';
import ApprovalView from '@/modules/Approval/ApprovalView';
import BookingDetailView from '@/modules/Approval/BookingDetailView';
import CompanyView from '@/modules/Company/CompanyView';
import BookingConfirmView from '@/modules/Create/BookingConfirmView';
import CreateFlowShell from '@/modules/Create/CreateFlowShell';
import CreateView from '@/modules/Create/CreateView';
import FlightSearchView from '@/modules/Create/FlightSearchView';
import HotelRoomView from '@/modules/Create/HotelRoomView';
import HotelSearchView from '@/modules/Create/HotelSearchView';
import EmployeeView from '@/modules/Employee/EmployeeView';
import HomeView from '@/modules/Home/HomeView';
import LoginView from '@/modules/Login/LoginView';
import MonitoringDepositView from '@/modules/Monitoring/MonitoringDepositView';
import ProfileView from '@/modules/Profile/ProfileView';
import ReportFlightView from '@/modules/Report/ReportFlightView';
import ReportHotelView from '@/modules/Report/ReportHotelView';
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
            <CreateFlowShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<CreateView />} />
        <Route path={CREATE_FLIGHT_SEARCH_SEGMENT} element={<FlightSearchView />} />
        <Route path={CREATE_HOTEL_SEARCH_SEGMENT} element={<HotelSearchView />} />
        <Route path={CREATE_HOTEL_ROOM_SEGMENT} element={<HotelRoomView />} />
        <Route path={CREATE_BOOKING_CONFIRM_SEGMENT} element={<BookingConfirmView />} />
      </Route>
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
            <PermittedRoute permission={PERMISSIONS.MONITORING_CREDIT}>
              <MonitoringDepositView />
            </PermittedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={MONITORING_DEPOSIT_PATH}
        element={
          <ProtectedRoute>
            <PermittedRoute permission={PERMISSIONS.MONITORING_DEPOSIT}>
              <MonitoringDepositView />
            </PermittedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path={REPORT_FLIGHT_PATH}
        element={
          <ProtectedRoute>
            <PermittedRoute permission={PERMISSIONS.REPORT_FLIGHT}>
              <ReportFlightView />
            </PermittedRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path={REPORT_HOTEL_PATH}
        element={
          <ProtectedRoute>
            <PermittedRoute permission={PERMISSIONS.REPORT_HOTEL}>
              <ReportHotelView />
            </PermittedRoute>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
