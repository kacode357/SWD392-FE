import React from 'react';
import { Menu } from 'antd';
import { SettingOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const ManagerSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: '/manage-users',
      icon: <TeamOutlined />,
      label: 'Manage Users',
      onClick: () => navigate('/manage-users'),
    },
    {
      key: '/reports',
      icon: <FileOutlined />,
      label: 'Reports',
      onClick: () => navigate('/reports'),
    },
    {
      key: '/setting',
      icon: <SettingOutlined />,
      label: 'Setting',
      onClick: () => navigate('/setting'),
    },
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

export default ManagerSidebar;
