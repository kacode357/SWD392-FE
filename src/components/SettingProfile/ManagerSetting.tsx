import { useState } from 'react';
import { Tabs } from 'antd';
import Setting from './Setting';
import ChangePassword from './ChangePassword';

const { TabPane } = Tabs;

const ManagerSetting = () => {
  const [activeTab, setActiveTab] = useState('setting');

  return (
    <div className="manager-setting">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="custom-tabs"
        tabBarStyle={{ borderBottom: '1px solid #e8e8e8', textAlign: 'left' }}
      >
        <TabPane tab="Setting" key="setting">
          <Setting />
        </TabPane>
        <TabPane tab="Change Password" key="changePassword">
          <ChangePassword />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ManagerSetting;
