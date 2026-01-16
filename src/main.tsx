import './index.css';
import 'antd/dist/reset.css';

import { ConfigProvider } from 'antd';
// import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@/routes';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#0d6eff',
      },
      components: {
        Layout: {
          headerHeight: 80,
          bodyBg: '#ffffff',
        },
        Menu: {
          itemSelectedBg: '#ffffff',
        },
      },
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ConfigProvider>,
  // </StrictMode>
);
