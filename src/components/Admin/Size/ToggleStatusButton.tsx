import React, { useState } from "react";
import { Switch, message } from "antd";
import { changeSizeStatusApi } from "../../../util/api"; // Import API mới

interface ToggleStatusButtonProps {
  isDelete: boolean;  // Trạng thái hiện tại (true nếu đã xóa, false nếu chưa)
  sizeId: number;     // ID của `Size`
  refreshSizes: () => void; // Hàm để refresh lại danh sách sau khi thay đổi trạng thái
}

const ToggleStatusButton: React.FC<ToggleStatusButtonProps> = ({ isDelete, sizeId, refreshSizes }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);
    try {
      // Gọi API để thay đổi trạng thái size
      await changeSizeStatusApi(sizeId, checked);
      message.success("Status updated successfully");
      refreshSizes();  // Làm mới danh sách `Size`
    } catch (error) {
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={!isDelete} // Đảo ngược trạng thái để kiểm soát bằng switch
      onChange={handleToggle}
      loading={loading}
    />
  );
};

export default ToggleStatusButton;
