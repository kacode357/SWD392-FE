import React from 'react';
import { Menu } from 'antd';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const UserSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: '/my-profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/my-profile'),
    },
    {
      key: '/setting',
      icon: <SettingOutlined />,
      label: 'Setting',
      onClick: () => navigate('/setting'),
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

export default UserSidebar;
