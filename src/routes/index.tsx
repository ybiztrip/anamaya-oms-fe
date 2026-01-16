import { Route, Routes } from 'react-router-dom';

import { HOME_PATH, LOGIN_PATH } from '@/constants/routePath';
import HomeView from '@/modules/Home/HomeView';
import LoginView from '@/modules/Login/LoginView';

function App() {
  return (
    <Routes>
      <Route path={HOME_PATH} element={<HomeView />} />
      <Route path={LOGIN_PATH} element={<LoginView />} />
    </Routes>
  );
}

export default App;
