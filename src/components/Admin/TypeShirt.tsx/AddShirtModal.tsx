import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Select, message } from "antd";
import { createTypeShirtApi, searchSessionApi, searchClubApi } from "../../../util/api"; // Giả sử API đã được import

const { Option } = Select;

interface AddTypeShirtModalProps {
  visible: boolean;
  onClose: () => void;
  refreshShirts: () => void;
}

const AddTypeShirtModal: React.FC<AddTypeShirtModalProps> = ({ visible, onClose, refreshShirts }) => {
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
        pageSize: 300,
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
        pageSize: 300,
        keyWord: keyword,
        status: true,
      });
      setClubs(response.pageData);
    } catch (error) {
      message.error("Failed to fetch clubs");
    }
  };

  useEffect(() => {
    fetchSessions(); // Fetch sessions on load
    fetchClubs();    // Fetch clubs on load
  }, []);

  const handleAddTypeShirt = async () => {
    try {
      const values = form.getFieldsValue();
      values.status = true; // Đặt giá trị status luôn là true
      setLoading(true);
      await createTypeShirtApi(values); // API tạo mới loại áo
      message.success("Type shirt created successfully");
      refreshShirts(); // Làm mới danh sách áo
      onClose();           // Đóng modal
    } catch (error) {
      message.error("Failed to create type shirt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Type Shirt"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="add" type="primary" loading={loading} onClick={handleAddTypeShirt}>
          Add
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: true, // Đặt giá trị mặc định cho status là true
        }}
      >
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

        <Form.Item
          name="name"
          label="Type Shirt Name"
          rules={[{ required: true, message: "Please enter the type shirt name" }]}
        >
          <Input placeholder="Enter type shirt name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter the description" }]}
        >
          <Input.TextArea placeholder="Enter description" />
        </Form.Item>

       
      
      </Form>
    </Modal>
  );
};

export default AddTypeShirtModal;
