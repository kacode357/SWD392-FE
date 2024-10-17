import React, { useState } from 'react';
import { Switch, message } from 'antd';
import { changeSessionStatusApi } from '../../../util/api';

interface ToggleStatusButtonProps {
  sessionId: number;
  isDelete: boolean;
  refreshSessions: () => void;
}

const ToggleStatusButton: React.FC<ToggleStatusButtonProps> = ({ sessionId, isDelete, refreshSessions }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    try {
      // Gọi API để thay đổi trạng thái
      const response = await changeSessionStatusApi(sessionId, checked);
      if (response) {
        message.success('Session status updated successfully');
        refreshSessions(); // Làm mới danh sách các session
      } else {
        message.error('Failed to update session status');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      loading={loading}
      checked={!isDelete} // Nếu không bị xóa (hoặc không bị vô hiệu hóa) thì checked là true
      onChange={handleToggle} // Gọi hàm khi người dùng thay đổi trạng thái
    />
  );
};

export default ToggleStatusButton;
