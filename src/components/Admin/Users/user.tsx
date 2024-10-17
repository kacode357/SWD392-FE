import React, { useEffect, useState } from "react";
import { Table, Avatar, Input, Button, Space, Row, Col, Tabs } from "antd";
import { getAllUserApi } from "../../../util/api";
import ToggleStatusButton from "./ToggleStatusButton";
import EditUserModal from "./EditUserModal";
import AddUserModal from "./AddUserButton";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";

const { Search } = Input;
const { TabPane } = Tabs;

interface User {
  id: number;
  email: string;
  userName: string;
  status: boolean;
  imgUrl: string;
}

const UserComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("activeUsers"); // State to manage active tab
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // Fetch users from API
  const fetchUsers = async (
    page = 1,
    pageSize = 10,
    keyword = "",
    isDeleted = false
  ) => {
    setLoading(true);
    const data = {
      pageNum: page,
      pageSize: pageSize,
      keyWord: keyword,
      role: "all",
      status: true,
      is_Verify: true,
      is_Delete: isDeleted,
    };
    const response = await getAllUserApi(data);

    setUsers(response.pageData);
    setPagination({
      current: response.pageInfo.page,
      pageSize: response.pageInfo.size,
      total: response.pageInfo.totalItem,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle table pagination changes
  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchUsers(current, pageSize, searchKeyword, activeTab === "deletedUsers");
  };

  // Handle search functionality
  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchUsers(1, pagination.pageSize, value, activeTab === "deletedUsers");
  };

  // Handle reset functionality
  const handleReset = () => {
    setSearchKeyword("");
    fetchUsers(1, pagination.pageSize, "", activeTab === "deletedUsers");
  };

  // Handle Add User button click
  const handleAddUser = () => {
    setIsAddUserModalVisible(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsAddUserModalVisible(false);
    setIsEditModalVisible(false);
    setEditingUserId(null);
  };

  // Open EditUserModal
  const handleEditUser = (userId: number) => {
    setEditingUserId(userId);
    setIsEditModalVisible(true);
  };

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    fetchUsers(1, pagination.pageSize, searchKeyword, key === "deletedUsers");
  };

  // Table columns
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Status",
      dataIndex: "isDelete",
      key: "isDelete",
      render: (isDelete: boolean, record: User) => (
        <ToggleStatusButton
          isDelete={isDelete}
          userId={record.id}
          refreshUsers={() =>
            fetchUsers(
              pagination.current,
              pagination.pageSize,
              searchKeyword,
              activeTab === "deletedUsers"
            )
          }
        />
      ),
    },
    {
      title: "Avatar",
      dataIndex: "imgUrl",
      key: "imgUrl",
      render: (imgUrl: string) => <Avatar src={imgUrl} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: User) => (
        <EditOutlined
          onClick={() => handleEditUser(record.id)}
          style={{ color: "black", cursor: "pointer" }}
        />
      ),
    },
  ];

  return (
    <div>
      {/* Tabs at the top */}
      <Tabs
        className="custom-tabs"
        defaultActiveKey="activeUsers"
        onChange={handleTabChange}
      >
        <TabPane tab="Active Users" key="activeUsers">
          {/* Content for active users */}
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Space className="custom-search">
                <Search
                  placeholder="Search by keyword"
                  onSearch={onSearch}
                  enterButton
                  allowClear
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <ReloadOutlined
                  onClick={handleReset}
                  style={{ fontSize: "24px", cursor: "pointer" }}
                />
              </Space>
            </Col>
            <Col>
              <button className="custom-button" onClick={handleAddUser}>
                Add User
              </button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            loading={loading}
            onChange={handleTableChange}
          />
        </TabPane>
        <TabPane tab="Deleted Users" key="deletedUsers">
          {/* Content for deleted users */}
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Space>
                <Search
                  placeholder="Search by keyword"
                  onSearch={onSearch}
                  enterButton
                  allowClear
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Button onClick={handleReset}>Reset</Button>
              </Space>
            </Col>
            <Col>
              <Button type="primary" onClick={handleAddUser}>
                Add User
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            loading={loading}
            onChange={handleTableChange}
          />
        </TabPane>
      </Tabs>

      {/* AddUserModal Component */}
      <AddUserModal
        visible={isAddUserModalVisible}
        onClose={handleCloseModal}
        refreshUsers={() =>
          fetchUsers(
            pagination.current,
            pagination.pageSize,
            searchKeyword,
            activeTab === "deletedUsers"
          )
        }
      />

      {/* EditUserModal Component */}
      {editingUserId && (
        <EditUserModal
          userId={editingUserId}
          visible={isEditModalVisible}
          onClose={handleCloseModal}
          refreshUsers={() =>
            fetchUsers(
              pagination.current,
              pagination.pageSize,
              searchKeyword,
              activeTab === "deletedUsers"
            )
          }
        />
      )}
    </div>
  );
};

export default UserComponent;
