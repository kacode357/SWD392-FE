import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Switch } from "antd";
import { createSizeApi } from "../../../util/api"; // Giả sử bạn có API tạo size mới

interface AddSizeModalProps {
  visible: boolean;
  onClose: () => void;
  refreshSizes: () => void;
}

const AddSizeModal: React.FC<AddSizeModalProps> = ({ visible, onClose, refreshSizes }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddSize = async () => {
    try {
      setLoading(true);
      const values = form.getFieldsValue();
      const data = {
        name: values.name,
        description: values.description,
        status: values.status, // Không đặt mặc định là true
      };
      await createSizeApi(data); // Gọi API để tạo size mới
      message.success("Size added successfully");
      refreshSizes(); // Làm mới danh sách sau khi thêm size
      onClose(); // Đóng modal
      form.resetFields(); // Reset form sau khi thêm thành công
    } catch (error) {
      message.error("Failed to add size.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Add New Size"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleAddSize} loading={loading}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Size Name" rules={[{ required: true, message: "Please input the size name" }]}>
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

export default AddSizeModal;
