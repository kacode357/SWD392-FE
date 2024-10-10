import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, DatePicker } from 'antd';
import { getSessionByIdApi, editSessionApi } from '../../../util/api';
import moment from 'moment'; // Sử dụng Moment cho DatePicker

interface EditSessionModalProps {
  sessionId: number;
  visible: boolean;
  onClose: () => void;
  refreshSessions: () => void;
}

const EditSessionModal: React.FC<EditSessionModalProps> = ({ sessionId, visible, onClose, refreshSessions }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);

  useEffect(() => {
    if (visible) {
      fetchSessionDetails();
    }
  }, [visible]);

  // Fetch session details from API and set initial form values
  const fetchSessionDetails = async () => {
    try {
      const response = await getSessionByIdApi(sessionId);
      if (response) {
        const sessionData = response;
        form.setFieldsValue({
          name: sessionData.name,
          description: sessionData.description,
          startDate: sessionData.startDdate ? moment(sessionData.startDdate) : null,
          endDate: sessionData.endDdate ? moment(sessionData.endDdate) : null,
        });
        setStartDate(sessionData.startDdate ? moment(sessionData.startDdate) : null);
        setEndDate(sessionData.endDdate ? moment(sessionData.endDdate) : null);
      }
    } catch (error) {
      message.error('Failed to fetch session details');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (!startDate || !endDate) {
        message.error('Please select both start and end dates');
        setLoading(false);
        return;
      }

      // Prepare data to be sent to API
      const updatedSession = {
        name: values.name,
        startDdate: startDate.toISOString(), // Moment có sẵn toISOString
        endDdate: endDate.toISOString(),
        description: values.description,
      };

      const response = await editSessionApi(sessionId, updatedSession);
      if (response) {
        message.success('Session updated successfully');
        onClose();
        refreshSessions(); // Refresh session list
      } else {
        message.error('Failed to update session');
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
      title="Edit Session"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Save
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
            value={startDate} // sử dụng giá trị moment
            onChange={(date) => setStartDate(date)}
          />
        </Form.Item>

        {/* Ngày kết thúc */}
        <Form.Item name="endDate" label="End Date" rules={[{ required: true, message: 'Please select end date' }]}>
          <DatePicker
            style={{ width: '100%' }}
            value={endDate} // sử dụng giá trị moment
            onChange={(date) => setEndDate(date)}
          />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input session description' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSessionModal;
