import React, { useState } from "react";
import { Switch, message } from "antd";
import { changeTypeShirtStatusApi } from "../../../util/api"; // Giả sử có API tương ứng

interface ToggleStatusButtonProps {
  isDelete: boolean;
  shirtId: number;
  refreshShirts: () => void;
}

const ToggleStatusButton: React.FC<ToggleStatusButtonProps> = ({ isDelete, shirtId, refreshShirts }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    try {
      await changeTypeShirtStatusApi(shirtId, checked); // API cập nhật trạng thái
      message.success(checked ? "Activated successfully" : "Deactivated successfully");
      refreshShirts(); // Làm mới danh sách áo
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={!isDelete}  // checked = true nếu áo đang active, ngược lại là inactive
      onChange={handleToggle}
      loading={loading}
    />
  );
};

export default ToggleStatusButton;
