import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, message } from "antd";
import { getTypeShirtByIdApi, updateTypeShirtApi, searchSessionApi, searchClubApi } from "../../../util/api"; // Giả sử có API tương ứng

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
  const [sessions, setSessions] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [searchSessionKeyword, setSearchSessionKeyword] = useState("");
  const [searchClubKeyword, setSearchClubKeyword] = useState("");

  // Fetch sessions for selection
  const fetchSessions = async (keyword = "") => {
    try {
      const response = await searchSessionApi({
        pageNum: 1,
        pageSize: 10,
        keyWord: keyword,
        status: true,
      });
      setSessions(response.pageData);
    } catch (error) {
      message.error("Failed to fetch sessions");
    }
  };

  // Fetch clubs for selection
  const fetchClubs = async (keyword = "") => {
    try {
      const response = await searchClubApi({
        pageNum: 1,
        pageSize: 10,
        keyWord: keyword,
        status: true,
      });
      setClubs(response.pageData);
    } catch (error) {
      message.error("Failed to fetch clubs");
    }
  };

  useEffect(() => {
    if (shirtId && visible) {
      // Fetch shirt details when modal is visible and shirtId is valid
      getTypeShirtByIdApi(shirtId).then((shirt) => {
        form.setFieldsValue({
          name: shirt.name,
          description: shirt.description,
          sessionId: shirt.sessionId,
          clubId: shirt.clubId,
        });
        // Fetch initial session and club data
        fetchSessions();
        fetchClubs();
      });
    }
  }, [shirtId, visible]);

  const handleSave = async () => {
    try {
      const values = form.getFieldsValue();
      setLoading(true);
      // Update shirt with new values
      await updateTypeShirtApi(shirtId, {
        ...values,
        status: true, // Đặt giá trị status luôn là true, không chỉnh sửa
      });
      message.success("Shirt updated successfully");
      refreshShirts(); // Làm mới danh sách áo
      onClose(); // Đóng modal
    } catch (error) {
      message.error("Failed to update shirt");
    } finally {
      setLoading(false);
    }
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
        <Form.Item name="name" label="Shirt Name" rules={[{ required: true, message: "Please enter shirt name" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="sessionId"
          label="Select Session"
          rules={[{ required: true, message: "Please select a session" }]}
        >
          <Select
            showSearch
            placeholder="Search and select a session"
            onSearch={setSearchSessionKeyword}
            onChange={() => fetchSessions(searchSessionKeyword)} // Fetch sessions based on search keyword
            filterOption={false}
          >
            {sessions.map((session: any) => (
              <Option key={session.id} value={session.id}>
                {session.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="clubId"
          label="Select Club"
          rules={[{ required: true, message: "Please select a club" }]}
        >
          <Select
            showSearch
            placeholder="Search and select a club"
            onSearch={setSearchClubKeyword}
            onChange={() => fetchClubs(searchClubKeyword)} // Fetch clubs based on search keyword
            filterOption={false}
          >
            {clubs.map((club: any) => (
              <Option key={club.id} value={club.id}>
                {club.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditShirtModal;
