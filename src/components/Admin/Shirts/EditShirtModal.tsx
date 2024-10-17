import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, message } from "antd";
import { getShirtByIdApi, updateShirtApi, searchTypeShirtApi, searchPlayerApi } from "../../../util/api"; // Giả sử có API tương ứng
import FileUploader from "../../../util/FileUploader"; // Import FileUploader component

const { Option } = Select;

interface EditShirtModalProps {
  shirtId: number;
  visible: boolean;
  onClose: () => void;
  refreshShirts: () => void;
}

const EditShirtModal: React.FC<EditShirtModalProps> = ({ shirtId, visible, onClose, refreshShirts }) => {
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
    if (shirtId && visible) {
      // Lấy thông tin áo để chỉnh sửa khi mở modal
      getShirtByIdApi(shirtId, shirtId).then((shirt) => {
        form.setFieldsValue({
          name: shirt.name,
          description: shirt.description,
          sessionId: shirt.sessionId,
          clubId: shirt.clubId,
        });
        setImageUrl(shirt.urlImg || null); // Lấy ảnh nếu có và set URL ảnh
      });
      fetchTypeShirts(); // Fetch type shirts on modal open
      fetchPlayers();    // Fetch players on modal open
    }
  }, [shirtId, visible]);

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();
      if (!imageUrl) {
        message.error("Please upload an image");
        return;
      }
      setLoading(true);
      await updateShirtApi(shirtId, {
        ...values,
        urlImg: imageUrl, // Pass the uploaded image URL
      }); // Cập nhật thông tin áo
      message.success("Shirt updated successfully");
      refreshShirts(); // Làm mới danh sách áo
      onClose(); // Đóng modal
    } catch (error) {
      message.error("Failed to update shirt");
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
      title="Edit Shirt"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSave}>
          Save
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
                {player.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="urlImg"
          label="Image"
        >
          <FileUploader onUploadSuccess={handleImageUploadSuccess} defaultImage={imageUrl || undefined} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditShirtModal;
