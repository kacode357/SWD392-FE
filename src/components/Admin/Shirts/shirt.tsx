import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Row, Col, Tabs, message, Avatar } from "antd";
import { searchShirtApi } from "../../../util/api"; // Giả sử có API tương ứng cho áo
import EditShirtModal from "./EditShirtModal";
import AddShirtModal from "./AddShirtModal";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import SelectStatusButton from "./ToggleStatusButton";

const { Search } = Input;
const { TabPane } = Tabs;


interface Shirt {
  id: number;
  name: string;
  description: string;
  number: number;
  typeShirtId: number;
  playerId: number;
  date: string;
  urlImg: string; // Hình ảnh áo
  status: number; // Sử dụng số để đại diện cho trạng thái (1: Active, 2: Inactive, 3: Archived)
}

const ShirtComponent: React.FC = () => {
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
  const fetchShirts = async (page = 1, pageSize = 10, keyword = "", status = 1) => {
    setLoading(true);
    const data = {
      pageNum: page,
      pageSize: pageSize,
      keyWord: keyword,
      status: status,
    };
    try {
      const response = await searchShirtApi(data);
      setShirts(response.pageData);
      setPagination({
        current: response.pageInfo.page,
        pageSize: response.pageInfo.size,
        total: response.pageInfo.totalItem,
      });
    } catch (error) {
      message.error("Failed to fetch shirts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShirts(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchShirts(current, pageSize, searchKeyword, activeTab === "deletedShirts" ? 0 : 1);
  };

  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchShirts(1, pagination.pageSize, value, activeTab === "deletedShirts" ? 0 : 1);
  };

  const handleReset = () => {
    setSearchKeyword("");
    fetchShirts(1, pagination.pageSize, "", activeTab === "deletedShirts" ? 0 : 1);
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
    fetchShirts(1, pagination.pageSize, searchKeyword, key === "deletedShirts" ? 0 : 1);
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
      title: "Shirt Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Type Shirt",
      dataIndex: "typeShirtName",
      key: "typeShirtId",
    },
    {
      title: "Player",
      dataIndex: "playerName",
      key: "playerId",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => moment(date).format('YYYY-MM-DD'), // Format date
    },
    {
      title: "Image",
      dataIndex: "urlImg",
      key: "urlImg",
      render: (urlImg: string) => <Avatar src={urlImg} />, // Render image using Avatar component
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number, record: Shirt) => (
        <SelectStatusButton
          currentStatus={status}
          shirtId={record.id}
          refreshShirts={() => fetchShirts(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedShirts" ? 0 : 1)}
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
              <Button className="custom-button" onClick={handleAddShirt}>Add Shirt</Button>
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
        refreshShirts={() => fetchShirts(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedShirts" ? 0 : 1)}
      />

      {editingShirtId && (
        <EditShirtModal
          shirtId={editingShirtId}
          visible={isEditModalVisible}
          onClose={handleCloseModal}
          refreshShirts={() => fetchShirts(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedShirts" ? 0 : 1)}
        />
      )}
    </div>
  );
};

export default ShirtComponent;
