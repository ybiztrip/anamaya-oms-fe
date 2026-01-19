import { Navigate } from 'react-router-dom';

import { CREATE_PATH } from '@/constants/routePath';

function Home() {
  return (
    <Navigate to={CREATE_PATH} replace />
  );
}
export default Home;
