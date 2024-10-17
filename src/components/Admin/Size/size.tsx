import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Row, Col, Tabs } from "antd";
import { searchSizeApi } from "../../../util/api"; // Thay đổi API
import ToggleStatusButton from "./ToggleStatusButton";
import EditSizeModal from "./EditSizeModal";
import AddSizeModal from "./AddSizeModal";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";

const { Search } = Input;
const { TabPane } = Tabs;

interface Size {
  id: number;
  name: string;
  desdcription: string;
  status: boolean;
}

const SizeComponent: React.FC = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("activeSizes");
  const [isAddSizeModalVisible, setIsAddSizeModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSizeId, setEditingSizeId] = useState<number | null>(null);

  // Fetch sizes from API
  const fetchSizes = async (page = 1, pageSize = 10, keyword = "", isDeleted = false) => {
    setLoading(true);
    const data = {
      pageNum: page,
      pageSize: pageSize,
      keyWord: keyword,
      status: !isDeleted,
    };
    const response = await searchSizeApi(data); // Thay đổi API
    setSizes(response.pageData);
    setPagination({
      current: response.pageInfo.page,
      pageSize: response.pageInfo.size,
      total: response.pageInfo.totalItem,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchSizes(pagination.current, pagination.pageSize);
  }, []);

  // Handle table pagination changes
  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchSizes(current, pageSize, searchKeyword, activeTab === "deletedSizes");
  };

  // Handle search functionality
  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchSizes(1, pagination.pageSize, value, activeTab === "deletedSizes");
  };

  // Handle reset functionality
  const handleReset = () => {
    setSearchKeyword("");
    fetchSizes(1, pagination.pageSize, "", activeTab === "deletedSizes");
  };

  // Handle Add Size button click
  const handleAddSize = () => {
    setIsAddSizeModalVisible(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsAddSizeModalVisible(false);
    setIsEditModalVisible(false);
    setEditingSizeId(null);
  };

  // Open EditSizeModal
  const handleEditSize = (sizeId: number) => {
    setEditingSizeId(sizeId);
    setIsEditModalVisible(true);
  };

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    fetchSizes(1, pagination.pageSize, searchKeyword, key === "deletedSizes");
  };

  // Table columns
  const columns = [
    {
      title: "Size Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: Size) => (
        <ToggleStatusButton
          isDelete={!status} // Pass whether the size is deactivated (true) or active (false)
          sizeId={record.id}  // Pass the size's ID
          refreshSizes={() => fetchSizes(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedSizes")} // Refresh sizes after toggling status
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Size) => (
        <EditOutlined
          onClick={() => handleEditSize(record.id)}
          style={{ color: 'black', cursor: 'pointer' }}
        />
      ),
    },
  ];

  return (
    <div>
      {/* Tabs at the top */}
      <Tabs className="custom-tabs" defaultActiveKey="activeSizes" onChange={handleTabChange}>
        <TabPane tab="Active Sizes" key="activeSizes">
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
              <button className="custom-button" onClick={handleAddSize}>Add Size</button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={sizes}
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
        <TabPane tab="Deleted Sizes" key="deletedSizes">
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
              <Button type="primary" onClick={handleAddSize}>Add Size</Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={sizes}
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

      {/* AddSizeModal Component */}
      <AddSizeModal
        visible={isAddSizeModalVisible}
        onClose={handleCloseModal}
        refreshSizes={() => fetchSizes(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedSizes")}
      />

      {/* EditSizeModal Component */}
      {editingSizeId && (
        <EditSizeModal
          sizeId={editingSizeId}
          visible={isEditModalVisible}
          onClose={handleCloseModal}
          refreshSizes={() => fetchSizes(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedSizes")}
        />
      )}
    </div>
  );
};

export default SizeComponent;
