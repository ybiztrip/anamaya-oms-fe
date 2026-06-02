import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Button, Image, Layout, Menu, Popover, Typography } from 'antd';
import { type ReactNode, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import AnamayaLogo from '@/assets/anamaya.webp';
import Background from '@/assets/background.jpg';
import { menus } from '@/constants/menu';
import { HOME_PATH } from '@/constants/routePath';
import { USER } from '@/constants/storageKey';
import useAuth from '@/hooks/useAuth';
import type { UserType } from '@/types';
import { localStorageGet } from '@/utils/localStorage';
import { isPermittedAny } from '@/utils/permission';

const { Header, Sider } = Layout;
const { Title } = Typography;

const matchesMenuPath = (path: string, currentPath: string) =>
  currentPath === path || currentPath.startsWith(`${path}/`);

const AppLayout = ({
  children,
  withSidebar = true,
}: {
  children: ReactNode;
  withSidebar?: boolean;
}) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const currentUser = localStorageGet<UserType>(USER);

  let selectedKey = '';
  let activeOpenKeys: string[] = [];

  const topMenu = menus.find(
    (menu) => menu.path && menu.childs.length === 0 && matchesMenuPath(menu.path, pathname),
  );
  if (topMenu) {
    selectedKey = topMenu.name;
  } else {
    for (const menu of menus) {
      const child = menu.childs.find((c) => matchesMenuPath(c.path, pathname));
      if (child) {
        selectedKey = child.name;
        activeOpenKeys = [menu.name];
        break;
      }
    }
  }

  const [userOpenKeys, setUserOpenKeys] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const mergedOpenKeys = [...new Set([...userOpenKeys, ...activeOpenKeys])];
  const menuItems = useMemo<MenuProps['items']>(() => {
    const items: NonNullable<MenuProps['items']> = [];

    menus.forEach((menu) => {
      const { name, title, path, childs, Icon, permissions } = menu;
      if (permissions && !isPermittedAny(permissions)) return;

      const children: NonNullable<MenuProps['items']> = [];
      childs.forEach((child) => {
        const {
          name: childName,
          title: childTitle,
          path: childPath,
          Icon: ChildIcon,
          permissions: childPermissions,
        } = child;
        if (childPermissions && !isPermittedAny(childPermissions)) return;
        children.push({
          key: childName,
          ...(ChildIcon ? { icon: <ChildIcon /> } : {}),
          className: 'layout-menu-child',
          title: `${title} / ${childTitle}`,
          label: <Link to={childPath}>{childTitle}</Link>,
        });
      });

      if (isCollapsed && children.length > 0) {
        items.push(...children);
        return;
      }

      items.push({
        key: name,
        ...(Icon ? { icon: <Icon /> } : {}),
        className: 'layout-menu-parent',
        label: path ? <Link to={path}>{title}</Link> : title,
        ...(children.length > 0 ? { children } : {}),
      });
    });

    return items;
  }, [isCollapsed]);

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
        <div className="flex items-center justify-end gap-4">
          <Popover
            trigger="click"
            placement="bottomRight"
            content={
              <div className="min-w-[240px]">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar size="large" icon={<UserOutlined />} />
                  <div className="flex flex-col">
                    <span className="font-semibold leading-tight">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </span>
                    <span className="text-xs text-gray-500 break-all">{currentUser?.email}</span>
                  </div>
                </div>
                <div className="h-px bg-gray-200 mb-3" />
                <div className="flex flex-col gap-2">
                  <Link to="/profile">
                    <Button block type="default">
                      Profile
                    </Button>
                  </Link>
                  <Button block type="primary" danger onClick={logout}>
                    Logout
                  </Button>
                </div>
              </div>
            }
          >
            <Avatar className="cursor-pointer" icon={<UserOutlined />} />
          </Popover>
        </div>
      </Header>
      <Layout>
        {withSidebar && (
          <Sider
            width={300}
            theme="light"
            collapsible
            breakpoint="lg"
            collapsedWidth={80}
            onCollapse={(collapsed) => setIsCollapsed(collapsed)}
            style={{ overflow: 'auto' }}
          >
            <Menu
              className="mt-8 app-sidebar-menu"
              mode="inline"
              selectedKeys={selectedKey ? [selectedKey] : []}
              openKeys={isCollapsed ? [] : mergedOpenKeys}
              onOpenChange={(keys) => setUserOpenKeys(keys)}
              items={menuItems}
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
