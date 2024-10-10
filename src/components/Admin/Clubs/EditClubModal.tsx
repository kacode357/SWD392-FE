import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, DatePicker, message } from 'antd';
import moment from 'moment'; // To handle date formatting
import { editClubApi, getClubByIdApi } from '../../../util/api'; // Import your APIs
import FileUploader from '../../../util/FileUploader'; // Import the FileUploader component

interface EditClubModalProps {
  visible: boolean;
  clubId: number | null; // The ID of the club to be edited
  onClose: () => void;
  refreshClubs: () => void;
}

const EditClubModal: React.FC<EditClubModalProps> = ({ visible, clubId, onClose, refreshClubs }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [clubLogo, setClubLogo] = useState<string>(''); // Store the uploaded club logo URL

  // Fetch existing club data when clubId is provided
  useEffect(() => {
    if (clubId) {
      const fetchClubDetails = async () => {
        try {
          const clubData = await getClubByIdApi(clubId); // Fetch club data by ID
          
          // Populate form fields with fetched data
          form.setFieldsValue({
            name: clubData.name,
            description: clubData.description,
            country: clubData.country,
            establishedYear: moment(clubData.establishedYear), // Use moment to convert date
            stadiumName: clubData.stadiumName,
          });

          setClubLogo(clubData.clubLogo); // Set the existing club logo
        } catch (error) {
          console.error('Failed to fetch club data:', error);
          message.error('Failed to fetch club data.');
        }
      };

      fetchClubDetails();
    }
  }, [clubId, form]);

  // Handle form submission to update club
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!clubLogo) {
        message.error('Please upload a club logo.');
        return;
      }

      const data = {
        ...values,
        establishedYear: values.establishedYear.toISOString(), // Convert moment object to ISO string
        clubLogo, // Attach the uploaded club logo URL
        status : true 
      };

      setLoading(true);
      await editClubApi(clubId as number, data); // Call the editClubApi with clubId and data
      message.success('Club updated successfully!');
      refreshClubs(); // Refresh the clubs list after saving
      onClose(); // Close the modal
      form.resetFields(); // Reset form fields
      setClubLogo(''); // Clear the logo state
      setLoading(false);
    } catch (error) {
      console.error('Failed to update club:', error);
      message.error('Failed to update club.');
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Club"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk} loading={loading}>
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Club Name" name="name" rules={[{ required: true, message: 'Please input the club name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Please input the country!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Established Year"
          name="establishedYear"
          rules={[{ required: true, message: 'Please select the established year!' }]}
        >
          <DatePicker picker="year" format="YYYY" />
        </Form.Item>
        <Form.Item label="Stadium Name" name="stadiumName" rules={[{ required: true, message: 'Please input the stadium name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>

        {/* Club Logo Upload */}
        <Form.Item label="Club Logo" required>
          <FileUploader
            defaultImage={clubLogo} // Show the existing logo if available
            onUploadSuccess={(url: string) => setClubLogo(url)} // Capture the uploaded file URL
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditClubModal;
