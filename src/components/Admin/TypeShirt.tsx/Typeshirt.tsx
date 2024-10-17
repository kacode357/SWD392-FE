import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Row, Col, Tabs } from "antd";
import { searchTypeShirtApi } from "../../../util/api"; // Giả sử có API tương ứng cho áo
import ToggleStatusButton from "./ToggleStatusButton";
import EditShirtModal from "./EditShirtModal";
import AddShirtModal from "./AddShirtModal";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";

const { Search } = Input;
const { TabPane } = Tabs;

interface Shirt {
  id: number;
  name: string;
  description: string;
  sessionId: number;
  clubId: number;
  status: boolean;
}

const Typeshirt: React.FC = () => {
  const [shirts, setShirts] = useState<Shirt[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("activeShirts");
  const [isAddShirtModalVisible, setIsAddShirtModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingShirtId, setEditingShirtId] = useState<number | null>(null);

  // Fetch shirts from API
  const fetchShirts = async (page = 1, pageSize = 10, keyword = "", isDeleted = false) => {
    setLoading(true);
    const data = {
      pageNum: page,
      pageSize: pageSize,
      keyWord: keyword,
      status: !isDeleted,
    };
    const response = await searchTypeShirtApi(data);
    console.log(response);
    setShirts(response.pageData);
    setPagination({
      current: response.pageInfo.page,
      pageSize: response.pageInfo.size,
      total: response.pageInfo.totalItem,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchShirts(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchShirts(current, pageSize, searchKeyword, activeTab === "deletedShirts");
  };

  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchShirts(1, pagination.pageSize, value, activeTab === "deletedShirts");
  };

  const handleReset = () => {
    setSearchKeyword("");
    fetchShirts(1, pagination.pageSize, "", activeTab === "deletedShirts");
  };

  const handleAddShirt = () => {
    setIsAddShirtModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsAddShirtModalVisible(false);
    setIsEditModalVisible(false);
    setEditingShirtId(null);
  };

  const handleEditShirt = (shirtId: number) => {
    setEditingShirtId(shirtId);
    setIsEditModalVisible(true);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    fetchShirts(1, pagination.pageSize, searchKeyword, key === "deletedShirts");
  };

  // Table columns
  const columns = [
    {
      title: "Shirt Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Session Name",
      dataIndex: "sessionName",
      key: "sessionId",
    },
    {
      title: "Club Name",
      dataIndex: "clubName",
      key: "clubId",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: Shirt) => (
        <ToggleStatusButton
          isDelete={!status}
          shirtId={record.id}
          refreshShirts={() => fetchShirts(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedShirts")}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Shirt) => (
        <EditOutlined
          onClick={() => handleEditShirt(record.id)}
          style={{ color: 'black', cursor: 'pointer' }}
        />
      ),
    },
  ];

  return (
    <div>
       <Tabs className="custom-tabs" defaultActiveKey="activeUsers" onChange={handleTabChange}>
        <TabPane tab="Active Shirts" key="activeShirts">
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
                <ReloadOutlined onClick={handleReset} style={{ fontSize: '24px', cursor: 'pointer' }} />
              </Space>
            </Col>
            <Col>
              <button className="custom-button" onClick={handleAddShirt}>Add Type Shirt</button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={shirts}
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
        <TabPane tab="Deleted Shirts" key="deletedShirts">
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Space>
                <Search
                  placeholder="Search by keyword"
                  onSearch={onSearch}
                  allowClear
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <Button onClick={handleReset}>Reset</Button>
              </Space>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={shirts}
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

      <AddShirtModal
        visible={isAddShirtModalVisible}
        onClose={handleCloseModal}
        refreshShirts={() => fetchShirts(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedShirts")}
      />

      {editingShirtId && (
        <EditShirtModal
          shirtId={editingShirtId}
          visible={isEditModalVisible}
          onClose={handleCloseModal}
          refreshShirts={() => fetchShirts(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedShirts")}
        />
      )}
    </div>
  );
};

export default Typeshirt;
