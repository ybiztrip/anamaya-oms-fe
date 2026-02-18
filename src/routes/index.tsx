import { Route, Routes } from 'react-router-dom';

import {
  APPROVAL_PATH,
  CREATE_BOOKING_CONFIRM_PATH,
  CREATE_FLIGHT_SEARCH_PATH,
  CREATE_PATH,
  HOME_PATH,
  LOGIN_PATH,
} from '@/constants/routePath';
import ApprovalView from '@/modules/Approval/ApprovalView';
import BookingConfirmView from '@/modules/Create/BookingConfirmView';
import CreateView from '@/modules/Create/CreateView';
import FlightSearchView from '@/modules/Create/FlightSearchView';
import HomeView from '@/modules/Home/HomeView';
import LoginView from '@/modules/Login/LoginView';

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
    </Routes>
  );
}

export default App;
