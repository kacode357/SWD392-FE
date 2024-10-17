import React from 'react';
import { Menu } from 'antd';
import { SettingOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const StaffSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      key: '/my-tasks',
      icon: <FileOutlined />,
      label: 'My Tasks',
      onClick: () => navigate('/my-tasks'),
    },
    {
      key: '/team',
      icon: <TeamOutlined />,
      label: 'Team',
      onClick: () => navigate('/team'),
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

export default StaffSidebar;
