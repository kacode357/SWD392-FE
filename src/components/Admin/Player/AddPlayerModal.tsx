import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, message } from "antd";
import { createPlayerApi, getAllClubApi } from "../../../util/api"; // Import the APIs for adding a new player and fetching clubs

interface AddPlayerModalProps {
  visible: boolean;
  onClose: () => void; // Function to close the modal
  refreshPlayers: () => void; // Function to refresh the player list
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ visible, onClose, refreshPlayers }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [clubOptions, setClubOptions] = useState<{ id: number; name: string }[]>([]);

  // Fetch clubs when modal becomes visible
  useEffect(() => {
    if (visible) {
      fetchClubs();
    }
  }, [visible]);

  // Fetch all clubs using API
  const fetchClubs = async () => {
    try {
      const response = await getAllClubApi({
        pageNum: 1,
        pageSize: 100, // Adjust this number based on how many clubs you want to fetch
        keyWord: "",
        status: true,
      });
      console.log("Club: ", response);
      if (response) {
        setClubOptions(response.pageData || []); // Assume response.pageData contains the list of clubs
      } else {
        message.error("Failed to fetch clubs");
      }
    } catch (error) {
      message.error("Error fetching clubs");
    }
  };

  // Handle form submission to add a new player
  const handleAddPlayer = async (values: any) => {
    setLoading(true);
    try {
      const response = await createPlayerApi(values);
      setLoading(false);
      if (response) {
        message.success("Player added successfully");
        refreshPlayers(); // Refresh player list after successful addition
        form.resetFields();
        onClose(); // Close the modal
      } else {
        message.error("Failed to add player");
      }
    } catch (error) {
      setLoading(false);
      message.error("Error adding player");
    }
  };

  return (
    <Modal
      title="Add New Player"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Add Player
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleAddPlayer}>
        <Form.Item name="fullName" label="Player Name" rules={[{ required: true, message: "Please enter player name" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="height" label="Height" rules={[{ required: true, message: "Please enter player height" }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="weight" label="Weight" rules={[{ required: true, message: "Please enter player weight" }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item name="birthday" label="Birth Date" rules={[{ required: true, message: "Please enter birth date" }]}>
          <Input type="date" />
        </Form.Item>
        <Form.Item name="nationality" label="Nationality" rules={[{ required: true, message: "Please enter nationality" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="clubId" label="Club" rules={[{ required: true, message: "Please select a club" }]}>
          <Select placeholder="Select a club">
            {clubOptions.map((club) => (
              <Select.Option key={club.id} value={club.id}>
                {club.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPlayerModal;
