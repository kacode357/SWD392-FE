import React, { useState } from 'react';
import { Switch, message } from 'antd';
import { changeClubStatusApi } from '../../../util/api'; // Import the actual API

interface ToggleStatusButtonProps {
  isDelete: boolean; // Initial status: true means the club is deactivated
  clubId: number;
  refreshClubs: () => void;
}

const ToggleStatusButton: React.FC<ToggleStatusButtonProps> = ({ isDelete, clubId, refreshClubs }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(!isDelete); // Track the current status locally

  // Function to toggle the club's status
  const toggleStatus = async (checked: boolean) => {
    setLoading(true);
    try {
      await changeClubStatusApi(clubId, checked); // Call the API with the new status
      message.success(`Club ${checked ? 'activated' : 'deactivated'} successfully!`);
      setStatus(checked); // Update local status after successful change
      refreshClubs(); // Refresh the list of clubs
    } catch (error) {
      message.error('Failed to change club status.');
      console.error('Error changing club status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={status} // Switch's checked status based on the current status
      onChange={toggleStatus} // Handle toggle action
      loading={loading} // Show loading state while processing
      checkedChildren="Active" // Label for active state
      unCheckedChildren="Inactive" // Label for inactive state
    />
  );
};

export default ToggleStatusButton;
