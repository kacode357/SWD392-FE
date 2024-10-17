import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Switch } from "antd";
import { getSizeByIdApi, updateSizeApi } from "../../../util/api"; // API bạn cung cấp

interface EditSizeModalProps {
  visible: boolean;
  sizeId: number;
  onClose: () => void;
  refreshSizes: () => void;
}

const EditSizeModal: React.FC<EditSizeModalProps> = ({ visible, sizeId, onClose, refreshSizes }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sizeId && visible) {
      fetchSizeDetails(sizeId);
    }
  }, [sizeId, visible]);

  // Fetch size details based on sizeId
  const fetchSizeDetails = async (id: number) => {
    try {
      const response = await getSizeByIdApi(id); // Gọi API để lấy thông tin size theo ID
      form.setFieldsValue({
        name: response.name,
        description: response.description,
        status: response.status,
      });
    } catch (error) {
      message.error("Failed to fetch size details.");
    }
  };

  // Handle updating size
  const handleUpdateSize = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const data = {
        name: values.name,
        description: values.description,
        status: values.status ?? true, // Nếu không có giá trị status thì mặc định là true
      };
      await updateSizeApi(sizeId, data); // Gọi API cập nhật size
      message.success("Size updated successfully");
      refreshSizes(); // Làm mới danh sách sau khi cập nhật
      onClose(); // Đóng modal
    } catch (error) {
      message.error("Failed to update size.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Edit Size"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleUpdateSize} loading={loading}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Size Name"
          rules={[{ required: true, message: "Please input the size name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input the size description" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default EditSizeModal;
