import { Button, Image, Layout, Menu, Typography } from 'antd';
import { type ReactNode, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import AnamayaLogo from '@/assets/anamaya.webp';
import Background from '@/assets/background.jpg';
import { menus } from '@/constants/menu';
import { HOME_PATH } from '@/constants/routePath';
import useAuth from '@/hooks/useAuth';

const { Header, Sider } = Layout;
const { Title } = Typography;

const AppLayout = ({
  children,
  withSidebar = true,
}: {
  children: ReactNode;
  withSidebar?: boolean;
}) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const selectedMenuKey = useMemo(() => {
    const selectedMenu = menus.find((menu) => menu.path === pathname);
    return selectedMenu ? selectedMenu.name : '';
  }, [pathname]);

  return (
    <Layout>
      <Header
        className="flex items-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${Background})`,
        }}
      >
        <Link to={HOME_PATH}>
          <div className="flex items-center h-full">
            <Image src={AnamayaLogo} width={150} preview={false} />
          </div>
        </Link>
        <Title level={4} className="flex-grow text-center">
          Anamaya Travel Platform
        </Title>
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      </Header>
      <Layout>
        {withSidebar && (
          <Sider trigger={null} width={300} theme="light">
            <Menu
              className="mt-8"
              mode="inline"
              selectedKeys={[selectedMenuKey]}
              items={menus.map((menu) => {
                const { name, title, path, childs } = menu;
                const children = childs.map((child) => {
                  const { name, title, path } = child;
                  return {
                    key: name,
                    label: <Link to={path}>{title}</Link>,
                  };
                });
                return {
                  key: name,
                  label: path ? <Link to={path}>{title}</Link> : title,
                  ...(children.length ? { children } : {}),
                };
              })}
            />
          </Sider>
        )}
        <Layout style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="p-8">{children}</div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
