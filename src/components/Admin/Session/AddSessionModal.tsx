import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, DatePicker } from 'antd';
import { createSessionApi } from '../../../util/api';

interface AddSessionModalProps {
  visible: boolean;
  onClose: () => void;
  refreshSessions: () => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ visible, onClose, refreshSessions }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null); // Lưu trữ ngày bắt đầu
  const [endDate, setEndDate] = useState<Date | null>(null);     // Lưu trữ ngày kết thúc

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Kiểm tra nếu ngày bắt đầu hoặc ngày kết thúc chưa được chọn
      if (!startDate || !endDate) {
        message.error('Please select both start and end dates');
        setLoading(false);
        return;
      }

      // Chuẩn bị dữ liệu cho API
      const sessionData = {
        name: values.name,
        startDdate: startDate.toISOString(),  // Convert to ISO string
        endDdate: endDate.toISOString(),      // Convert to ISO string
        description: values.description,
      };

      const response = await createSessionApi(sessionData);
      if (response) {
        message.success('Session added successfully');
        form.resetFields(); // Reset form sau khi thêm thành công
        setStartDate(null); // Reset giá trị startDate
        setEndDate(null);   // Reset giá trị endDate
        onClose();
        refreshSessions(); 
      } else {
        message.error('Failed to add session');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Add New Session"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Add
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="Session Name" rules={[{ required: true, message: 'Please input session name' }]}>
          <Input />
        </Form.Item>

        {/* Ngày bắt đầu */}
        <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Please select start date' }]}>
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date) => setStartDate(date?.toDate() || null)} // Lưu trữ ngày bắt đầu vào state
          />
        </Form.Item>

        {/* Ngày kết thúc */}
        <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'Please select end date' }]}>
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date) => setEndDate(date?.toDate() || null)} // Lưu trữ ngày kết thúc vào state
          />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input session description' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSessionModal;
