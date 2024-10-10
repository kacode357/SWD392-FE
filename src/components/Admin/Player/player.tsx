import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Row, Col, Tabs } from "antd";
import { searchPlayerApi } from "../../../util/api"; // Import the API for players
import ToggleStatusButton from "./ToggleStatusButton.tsx";
import EditPlayerModal from "./EditPlayerModal.tsx";
import AddPlayerModal from "./AddPlayerModal.tsx";
import moment from "moment";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";

const { Search } = Input;
const { TabPane } = Tabs;

interface Player {
  id: number;
  name: string;
  position: string;
  nationality: string;
  birthDate: string;
  clubName: string;
  playerPhoto: string;
  status: boolean;
}

const PlayerComponent: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("activePlayers");
  const [isAddPlayerModalVisible, setIsAddPlayerModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);

  // Fetch players from API
  const fetchPlayers = async (
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
      status: !isDeleted,
    };
    const response = await searchPlayerApi(data);
    console.log("check res : ",response);
    setPlayers(response.pageData);
    setPagination({
      current: response.pageInfo.page,
      pageSize: response.pageInfo.size,
      total: response.pageInfo.totalItem,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayers(pagination.current, pagination.pageSize);
  }, []);

  // Handle table pagination changes
  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchPlayers(
      current,
      pageSize,
      searchKeyword,
      activeTab === "deletedPlayers"
    );
  };

  // Handle search functionality
  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchPlayers(1, pagination.pageSize, value, activeTab === "deletedPlayers");
  };

  // Handle reset functionality
  const handleReset = () => {
    setSearchKeyword("");
    fetchPlayers(1, pagination.pageSize, "", activeTab === "deletedPlayers");
  };

  // Handle Add Player button click
  const handleAddPlayer = () => {
    setIsAddPlayerModalVisible(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsAddPlayerModalVisible(false);
    setIsEditModalVisible(false);
    setEditingPlayerId(null);
  };

  // Open EditPlayerModal
  const handleEditPlayer = (playerId: number) => {
    setEditingPlayerId(playerId);
    setIsEditModalVisible(true);
  };

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    fetchPlayers(
      1,
      pagination.pageSize,
      searchKeyword,
      key === "deletedPlayers"
    );
  };

  // Table columns
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "name",
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Birth Date",
      dataIndex: "birthDate",
      render: (birthDate: string) => moment(birthDate).format("YYYY-MM-DD"),
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: Player) => (
        <ToggleStatusButton
          isDelete={!status} // Trạng thái ban đầu: true nếu đang vô hiệu hóa
          clubId={record.id} // Giả sử bạn đang áp dụng cho đối tượng Player
          refreshClubs={() =>
            fetchPlayers(
              pagination.current,
              pagination.pageSize,
              searchKeyword,
              activeTab === "deletedPlayers"
            )
          }
        />
      ),
    },
    
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Player) => (
        <EditOutlined
          onClick={() => handleEditPlayer(record.id)}
          style={{ color: "black", cursor: "pointer" }}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs
        className="custom-tabs"
        defaultActiveKey="activeUsers"
        onChange={handleTabChange}
      >
        <TabPane tab="Active Players" key="activePlayers">
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
              <button className="custom-button" onClick={handleAddPlayer}>
                Add Player
              </button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={players}
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
        <TabPane tab="Deleted Players" key="deletedPlayers">
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
              <Button type="primary" onClick={handleAddPlayer}>
                Add Player
              </Button>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={players}
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

      {/* AddPlayerModal Component */}
      <AddPlayerModal
        visible={isAddPlayerModalVisible}
        onClose={handleCloseModal}
        refreshPlayers={() =>
          fetchPlayers(
            pagination.current,
            pagination.pageSize,
            searchKeyword,
            activeTab === "deletedPlayers"
          )
        }
      />

      {/* EditPlayerModal Component */}
      {editingPlayerId && (
        <EditPlayerModal
          playerId={editingPlayerId}
          visible={isEditModalVisible}
          onClose={handleCloseModal}
          refreshPlayers={() =>
            fetchPlayers(
              pagination.current,
              pagination.pageSize,
              searchKeyword,
              activeTab === "deletedPlayers"
            )
          }
        />
      )}
    </div>
  );
};

export default PlayerComponent;
