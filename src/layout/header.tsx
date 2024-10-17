import React, { useContext, useState, useEffect } from 'react';
import { Layout, Avatar, Dropdown, MenuProps, Skeleton, Badge } from 'antd';
import { UserOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/log 111-02.png';
import { AuthContext } from '../context/auth.context';
import { searchOrderApi } from '../util/api'; // Import API để lấy giỏ hàng

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  loading: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, setCollapsed, loading }) => {
  const { auth } = useContext(AuthContext);
  const [cartItemCount, setCartItemCount] = useState<number>(0); // State để lưu số lượng sản phẩm trong giỏ hàng
  const location = useLocation();
  const navigate = useNavigate();

  // Gọi API lấy giỏ hàng
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Gọi API với pageSize mặc định là 999
        const data = {
          pageNum: 1, // Trang đầu tiên
          pageSize: 10, // Lấy tối đa 999 sản phẩm trong giỏ hàng
          status: 1, // Status có thể là giá trị bạn cần
          date: '2024-10-15T09:28:43.145Z', // Nếu có giá trị date
        };

        const response = await searchOrderApi(data); // Gọi API
        console.log('Cart Data:', response); // Log dữ liệu ra console
        const totalItems = response.pageInfo.totalItem; // Lấy totalItem từ dữ liệu API
        console.log('totalItems:', totalItems); // Log dữ liệu ra console
        setCartItemCount(totalItems); // Đặt giá trị totalItem vào state
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    if (auth.isAuthenticated) {
      fetchCartData(); // Chỉ gọi API khi người dùng đã đăng nhập
    }
  }, [auth.isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const avatarMenuItems: MenuProps['items'] = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Link to="/my-profile">My Profile</Link>,
    },
    {
      key: '2',
      icon: <LogoutOutlined />,
      label: (
        <a onClick={handleLogout} style={{ display: 'flex', alignItems: 'center' }}>
          Logout
        </a>
      ),
    },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <Layout>
      <Header className="header flex justify-between items-center bg-black" style={{ zIndex: 1001, position: 'fixed', width: '100%' }}>
        {loading ? (
          <Skeleton active title={false} paragraph={{ rows: 0 }} avatar={true} />
        ) : (
          <>
            <div className="flex-1 flex justify-start">
              {!isHomePage &&
                React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: 'trigger',
                  style: { color: 'white', fontSize: '20px', cursor: 'pointer' },
                  onClick: () => setCollapsed(!collapsed),
                })}
            </div>

            {/* Center: Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/">
                <img src={logo} alt="logo" className="h-20 w-auto" />
              </Link>
            </div>

            {/* Right side: Avatar, Cart Icon or Sign In button */}
            <div className="flex-1 flex justify-end items-center">
              {/* Hiển thị giỏ hàng */}
              {auth.isAuthenticated && (
                <Badge count={cartItemCount} offset={[10, 0]}>
                  <ShoppingCartOutlined
                    style={{ color: 'white', fontSize: '24px', cursor: 'pointer' }}
                    onClick={() => navigate('/cart')} // Điều hướng đến trang giỏ hàng
                  />
                </Badge>
              )}

              {auth.isAuthenticated ? (
                <Dropdown menu={{ items: avatarMenuItems }} trigger={['hover']} placement="bottomRight">
                  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: '20px' }}>
                    <Avatar icon={<UserOutlined />} />
                    <span style={{ color: 'white', marginLeft: '10px' }}>Hello, {auth.user.name}</span>
                  </div>
                </Dropdown>
              ) : (
                <button
                  className="bg-white text-gray-900 py-2 px-4 rounded-md max-w-xs w-auto mr-4 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '6px 12px',
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    marginRight: '10px',
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </>
        )}
      </Header>
    </Layout>
  );
};

export default AppHeader;
