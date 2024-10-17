import React, { useState } from "react";
import { Select, message } from "antd";
import { changeShirtStatusApi } from "../../../util/api"; // Giả sử có API tương ứng

const { Option } = Select;

interface SelectStatusButtonProps {
  currentStatus: number; // Trạng thái hiện tại của áo (ví dụ: 1 = active, 2 = inactive, 3 = archived)
  shirtId: number;
  refreshShirts: () => void;
}

const SelectStatusButton: React.FC<SelectStatusButtonProps> = ({ currentStatus, shirtId, refreshShirts }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status: number) => {
    setLoading(true);
    try {
      await changeShirtStatusApi(shirtId, status); // Gọi API để thay đổi trạng thái
      message.success("Shirt status updated successfully");
      refreshShirts(); // Làm mới danh sách áo
    } catch (error) {
      message.error("Failed to update shirt status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={currentStatus} // Hiển thị trạng thái hiện tại của áo
      style={{ width: 160 }}
      onChange={handleStatusChange}
      loading={loading}
    >
      <Option value={1}>Active</Option>       {/* Trạng thái hoạt động */}
      <Option value={2}>Inactive</Option>     {/* Trạng thái không hoạt động */}
      <Option value={3}>Archived</Option>     {/* Trạng thái lưu trữ */}
    </Select>
  );
};

export default SelectStatusButton;
