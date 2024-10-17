import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Select, DatePicker } from "antd";
import { createShirtApi, searchTypeShirtApi, searchPlayerApi } from "../../../util/api"; // Giả sử có API tương ứng
import FileUploader from "../../../util/FileUploader"; // Import FileUploader component

const { Option } = Select;

interface AddShirtModalProps {
  visible: boolean;
  onClose: () => void;
  refreshShirts: () => void;
}

const AddShirtModal: React.FC<AddShirtModalProps> = ({ visible, onClose, refreshShirts }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [typeShirts, setTypeShirts] = useState([]);
  const [players, setPlayers] = useState([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Store uploaded image URL

  // Fetch type shirts for selection
  const fetchTypeShirts = async (keyword = "") => {
    const data = {
      pageNum: 1,
      pageSize: 10,
      keyWord: keyword,
      status: true,
    };
    const response = await searchTypeShirtApi(data);
    setTypeShirts(response.pageData);
  };

  // Fetch players for selection
  const fetchPlayers = async (keyword = "") => {
    const data = {
      pageNum: 1,
      pageSize: 10,
      keyWord: keyword,
      status: true,
    };
    const response = await searchPlayerApi(data);
    setPlayers(response.pageData);
  };

  useEffect(() => {
    fetchTypeShirts(); // Load type shirts on mount
    fetchPlayers();    // Load players on mount
  }, []);

  const handleAdd = async () => {
    try {
      const values = form.getFieldsValue();
      if (!imageUrl) {
        message.error("Please upload an image");
        return;
      }
      setLoading(true);
      await createShirtApi({
        ...values,
        date: values.date.format('YYYY-MM-DD'), // Format date before sending
        urlImg: imageUrl, // Use the uploaded image URL
        status: 1, // Set default status to active
      }); // Call API to create the shirt
      message.success("Shirt added successfully");
      refreshShirts(); // Refresh shirt list
      onClose(); // Close modal
    } catch (error) {
      message.error("Failed to add shirt");
    } finally {
      setLoading(false);
    }
  };

  // Callback when image upload succeeds
  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    message.success("Image uploaded successfully");
  };

  return (
    <Modal
      title="Add New Shirt"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="add" type="primary" loading={loading} onClick={handleAdd}>
          Add
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Shirt Name"
          rules={[{ required: true, message: "Please enter shirt name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="typeShirtId"
          label="Select Type Shirt"
          rules={[{ required: true, message: "Please select a type shirt" }]}
        >
          <Select
            showSearch
            placeholder="Search and select a type shirt"
            filterOption={false}
            onSearch={fetchTypeShirts}
          >
            {typeShirts.map((typeShirt: any) => (
              <Option key={typeShirt.id} value={typeShirt.id}>
                {typeShirt.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="playerId"
          label="Select Player"
          rules={[{ required: true, message: "Please select a player" }]}
        >
          <Select
            showSearch
            placeholder="Search and select a player"
            filterOption={false}
            onSearch={fetchPlayers}
          >
            {players.map((player: any) => (
              <Option key={player.id} value={player.id}>
                {player.fullName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="number"
          label="Shirt Number"
          rules={[{ required: true, message: "Please enter shirt number" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select the date" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          name="urlImg"
          label="Image"
        >
          <FileUploader onUploadSuccess={handleImageUploadSuccess} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddShirtModal;
