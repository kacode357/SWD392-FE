import React, { useEffect, useState } from "react";
import { Table, Input, Space, Row, Col, Modal, Button, List, Image, Tabs } from "antd";
import { searchOrderApi } from "../../../util/api";
import moment from "moment";
import { ReloadOutlined } from "@ant-design/icons";
import StatusTag from "../../../constants/StatusTag";
import UpdateStatusComponent from "./UpdateStatusComponent";
import StatusFlow from "../../StepsStatus/StepsOrderAdmin";
const { Search } = Input;
const { TabPane } = Tabs;

const OrdersComponent: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const fetchOrders = async (
    page = 1,
    pageSize = 10,
    keyword = "",
    status: number | null = null
  ) => {
    setLoading(true);
    const data = {
      pageNum: page,
      pageSize: pageSize,
      orderId: keyword,
      status: activeTab === "rejected" ? 7 : status, // Ensure status is 7 for rejected tab
    };
    const response = await searchOrderApi(data);
    setOrders(response.pageData);
    setPagination({
      current: response.pageInfo.page,
      pageSize: response.pageInfo.size,
      total: response.pageInfo.totalItem,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize, searchKeyword);
  }, [activeTab]);

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setPagination((prev) => ({ ...prev, current, pageSize }));
    fetchOrders(current, pageSize, searchKeyword);
  };

  const onSearch = (value: string) => {
    setSearchKeyword(value);
    fetchOrders(1, pagination.pageSize, value);
  };

  const handleReset = () => {
    setSearchKeyword("");
    fetchOrders(1, pagination.pageSize, "");
  };

  const showModal = (orderDetails: any[]) => {
    setSelectedOrderDetails(orderDetails);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "userName",
      key: "userUserName",
    },
    {
      title: "Order Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) =>
        date !== "0001-01-01T00:00:00" ? moment(date).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: <div style={{ textAlign: "center" }}>Total Price</div>,
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice: number) => (
        <div style={{ textAlign: "right" }}>{`${totalPrice.toLocaleString()} VNĐ`}</div>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => <StatusTag status={status} />,
    },
    {
      title: "View Details",
      key: "viewDetails",
      render: (order: any) => (
        <Button type="link" onClick={() => showModal(order.orderDetails)}>
          View Details
        </Button>
      ),
    },
    {
      title: "Change Status",
      key: "changeStatus",
      render: (order: any) => (
        <UpdateStatusComponent
          order={order}
          onStatusUpdated={() => fetchOrders(pagination.current, pagination.pageSize)}
        />
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset pagination on tab change
    fetchOrders(1, pagination.pageSize, searchKeyword, key === "rejected" ? 7 : null);
  };

  return (
    <div>
      <StatusFlow />
      <Tabs className="custom-tabs" defaultActiveKey="activeUsers" onChange={handleTabChange}>
        <TabPane tab="All Orders" key="all">
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Space className="custom-search">
                <Search
                  style={{ width: 400 }}
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
          </Row>
          <Table
            columns={columns}
            dataSource={orders}
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
        <TabPane tab="Rejected Orders" key="rejected">
          <Row justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Space className="custom-search">
                <Search
                  style={{ width: 400 }}
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
          </Row>
          <Table
            columns={columns}
            dataSource={orders}
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

      <Modal
        title="Order Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <List
          itemLayout="vertical"
          dataSource={selectedOrderDetails}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Image width={100} src={item.shirtUrlImg} />}
                title={item.shirtName}
                description={item.shirtDescription}
              />
              <p>Size: {item.sizeName} ({item.sizeDescription})</p>
              <p>Price: {item.price.toLocaleString()} VNĐ</p>
              <p>Quantity: {item.quantity}</p>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default OrdersComponent;
