import { Route, Routes } from 'react-router-dom';

import { HOME_PATH, LOGIN_PATH } from '@/constants/routePath';
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
    </Routes>
  );
}

export default App;
