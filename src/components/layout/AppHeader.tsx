import React from 'react';
import { Layout, Button, Avatar, Dropdown, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{ fontSize: '16px', width: 64, height: 64 }}
      />
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar icon={<UserOutlined />} />
          <span>{user?.name}</span>
        </Space>
      </Dropdown>
    </Header>
  );
};

export default AppHeader;
