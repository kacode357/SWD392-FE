import React from 'react';
import { Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const items = [
    {
      key: '/admin/manager-user',
      icon: <UserOutlined />,
      label: 'Manager Account',
      onClick: () => navigate('/admin/manager-user'),
    },
    {
      key: '/admin/manager-session',
      icon: <UserOutlined />,
      label: 'Manager Session',
      onClick: () => navigate('/admin/manager-session'),
    },
    {
      key: '/admin/manager-club',
      icon: <UserOutlined />,
      label: 'Manager Club',
      onClick: () => navigate('/admin/manager-club'),
    },
    {
      key: '/admin/manager-size',
      icon: <UserOutlined />,
      label: 'Manager Size',
      onClick: () => navigate('/admin/manager-size'),
    },
    {
      key: '/admin/manager-player',
      icon: <UserOutlined />,
      label: 'Manager Player',
      onClick: () => navigate('/admin/manager-player'),
    },
    {
      key: '/admin/manager-type-shirt',
      icon: <UserOutlined />,
      label: 'Manager Type Shirt',
      onClick: () => navigate('/admin/manager-type-shirt'),
    },
    {
      key: '/admin/manager-shirt',
      icon: <UserOutlined />,
      label: 'Manager Shirt',
      onClick: () => navigate('/admin/manager-shirt'),
    },
    {
      key: '/admin/manager-shirt-size',
      icon: <UserOutlined />,
      label: 'Manager Shirt Size',
      onClick: () => navigate('/admin/manager-shirt-size'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    }
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      style={{ height: '100%', borderRight: 0, marginTop: '64px' }}
      items={items}
    />
  );
};

export default AdminSidebar;
