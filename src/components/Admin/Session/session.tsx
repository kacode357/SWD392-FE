import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Row, Col, Tabs } from "antd";
import { searchSessionApi } from "../../../util/api";
import ToggleStatusButton from "./ToggleStatusButton";
import EditSessionModal from "./EditSessionModal";
import AddSessionModal from "./AddSessionModal";
import moment from "moment";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";

const { Search } = Input;
const { TabPane } = Tabs;

interface Session {
  id: number;
  name: string;
  startDdate: string;
  endDdate: string;
  description: string;
  status: boolean;
}

const SessionComponent: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("activeSessions");
  const [isAddSessionModalVisible, setIsAddSessionModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);

  // Fetch sessions from API
  const fetchSessions = async (page = 1, pageSize = 10, keyword = "", isDeleted = false) => {
    setLoading(true);
    const data = {
      pageNum: page,
      pageSize: pageSize,
      keyWord: keyword,
      status: !isDeleted,
    };
    const response = await searchSessionApi(data);
    setSessions(response.pageData);
    setPagination({
      current: response.pageInfo.page,
      pageSize: response.pageInfo.size,
      total: response.pageInfo.totalItem,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions(pagination.current, pagination.pageSize);
  }, []);

  // Handle table pagination changes
  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchSessions(current, pageSize, searchKeyword, activeTab === "deletedSessions");
  };

  // Handle search functionality
  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchSessions(1, pagination.pageSize, value, activeTab === "deletedSessions");
  };

  // Handle reset functionality
  const handleReset = () => {
    setSearchKeyword("");
    fetchSessions(1, pagination.pageSize, "", activeTab === "deletedSessions");
  };

  // Handle Add Session button click
  const handleAddSession = () => {
    setIsAddSessionModalVisible(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsAddSessionModalVisible(false);
    setIsEditModalVisible(false);
    setEditingSessionId(null);
  };

  // Open EditSessionModal
  const handleEditSession = (sessionId: number) => {
    setEditingSessionId(sessionId);
    setIsEditModalVisible(true);
  };

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    fetchSessions(1, pagination.pageSize, searchKeyword, key === "deletedSessions");
  };

  // Table columns
  const columns = [
    {
      title: "Session Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startDdate",
      render: (startDdate: string) => moment(startDdate).format('YYYY-MM-DD'),
    },
    {
      title: "End Date",
      dataIndex: "endDdate",
      render: (endDdate: string) => moment(endDdate).format('YYYY-MM-DD'),
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
      render: (status: boolean, record: Session) => (
        <ToggleStatusButton
          isDelete={!status} 
          sessionId={record.id}
          refreshSessions={() => fetchSessions(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedSessions")}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Session) => (
        <EditOutlined
          onClick={() => handleEditSession(record.id)}
          style={{ color: 'black', cursor: 'pointer' }}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs className="custom-tabs" defaultActiveKey="activeUsers" onChange={handleTabChange}>
        <TabPane tab="Active Sessions" key="activeSessions">
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
              <button className="custom-button" onClick={handleAddSession}>Add Season</button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={sessions}
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
        <TabPane tab="Deleted Sessions" key="deletedSessions">
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
          
              <button className="custom-button" onClick={handleAddSession}>Add Season</button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={sessions}
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

      {/* AddSessionModal Component */}
      <AddSessionModal
        visible={isAddSessionModalVisible}
        onClose={handleCloseModal}
        refreshSessions={() => fetchSessions(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedSessions")}
      />

      {/* EditSessionModal Component */}
      {editingSessionId && (
        <EditSessionModal
          sessionId={editingSessionId}
          visible={isEditModalVisible}
          onClose={handleCloseModal}
          refreshSessions={() => fetchSessions(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedSessions")}
        />
      )}
    </div>
  );
};

export default SessionComponent;
