import React, { useEffect, useState } from "react";
import { Table, Avatar, Input, Button, Space, Row, Col, Tabs } from "antd";
import { searchClubApi } from "../../../util/api";
import ToggleStatusButton from "./ToggleStatusButton";
import EditClubModal from "./EditClubModal";
import AddClubModal from "./AddClubModal";
import moment from "moment";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";

const { Search } = Input;
const { TabPane } = Tabs;

interface Club {
  id: number;
  name: string;
  country: string;
  establishedYear: number;
  stadiumName: string;
  clubLogo: string;
  status: boolean;
}

const ClubComponent: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("activeClubs");
  const [isAddClubModalVisible, setIsAddClubModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingClubId, setEditingClubId] = useState<number | null>(null);

  // Fetch clubs from API
  const fetchClubs = async (page = 1, pageSize = 10, keyword = "", isDeleted = false) => {
    setLoading(true);
    const data = {
      pageNum: page,
      pageSize: pageSize,
      keyWord: keyword,
      status: !isDeleted,
    };
    const response = await searchClubApi(data);
    setClubs(response.pageData);
    setPagination({
      current: response.pageInfo.page,
      pageSize: response.pageInfo.size,
      total: response.pageInfo.totalItem,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchClubs(pagination.current, pagination.pageSize);
  }, []);

  // Handle table pagination changes
  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchClubs(current, pageSize, searchKeyword, activeTab === "deletedClubs");
  };

  // Handle search functionality
  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchClubs(1, pagination.pageSize, value, activeTab === "deletedClubs");
  };

  // Handle reset functionality
  const handleReset = () => {
    setSearchKeyword("");
    fetchClubs(1, pagination.pageSize, "", activeTab === "deletedClubs");
  };

  // Handle Add Club button click
  const handleAddClub = () => {
    setIsAddClubModalVisible(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsAddClubModalVisible(false);
    setIsEditModalVisible(false);
    setEditingClubId(null);
  };

  // Open EditClubModal
  const handleEditClub = (clubId: number) => {
    setEditingClubId(clubId);
    setIsEditModalVisible(true);
  };

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    fetchClubs(1, pagination.pageSize, searchKeyword, key === "deletedClubs");
  };

  // Table columns
  const columns = [
    {
      title: "Club Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Established Year",
      dataIndex: "establishedYear",
      render: (establishedYear: number) => moment(establishedYear).format('YYYY'),
    },
    {
      title: "Stadium Name",
      dataIndex: "stadiumName",
      key: "stadiumName",
    },
    {
      title: "Club Logo",
      dataIndex: "clubLogo",
      key: "clubLogo",
      render: (clubLogo: string) => <Avatar src={clubLogo} />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: Club) => (
        <ToggleStatusButton
          isDelete={!status} // Pass whether the club is deactivated (true) or active (false)
          clubId={record.id}  // Pass the club's ID
          refreshClubs={() => fetchClubs(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedClubs")} // Refresh clubs after toggling status
        />
      ),
    }
    ,
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Club) => (

        <EditOutlined
          onClick={() => handleEditClub(record.id)}
          style={{ color: 'black', cursor: 'pointer' }}
        />
      ),
    },
  ];

  return (
    <div>
      {/* Tabs at the top */}
      <Tabs className="custom-tabs" defaultActiveKey="activeUsers" onChange={handleTabChange}>
        <TabPane tab="Active Clubs" key="activeClubs">
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
              <button className="custom-button" onClick={handleAddClub}>Add Club</button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={clubs}
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
        <TabPane tab="Deleted Clubs" key="deletedClubs">
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
              <Button type="primary" onClick={handleAddClub}>Add Club</Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={clubs}
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

      {/* AddClubModal Component */}
      <AddClubModal
        visible={isAddClubModalVisible}
        onClose={handleCloseModal}
        refreshClubs={() => fetchClubs(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedClubs")}
      />

      {/* EditClubModal Component */}
      {editingClubId && (
        <EditClubModal
          clubId={editingClubId}
          visible={isEditModalVisible}
          onClose={handleCloseModal}
          refreshClubs={() => fetchClubs(pagination.current, pagination.pageSize, searchKeyword, activeTab === "deletedClubs")}
        />
      )}
    </div>
  );
};

export default ClubComponent;
