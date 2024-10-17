// Import ROLES at the top
import { ROLES } from '../constants/index';  // Adjust the path as needed
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { AuthWrapper } from '../context/auth.context';
import PrivateRoute from './PrivateRoute';
import App from '../App';
import HomePage from '../pages/homepage';
import Login from '../pages/login';
import MyProfile from '../pages/User/MyProfile';
import SettingUser from '../pages/User/SettingUser';
import ManagerUser from '../pages/Admin/ManagerUser';
import ManagerClub from '../pages/Admin/ManagerClub';
import VerifyAccount from '../pages/User/VerifyAccount';
import NotFound from '../pages/NotFound';
import ManagerSession from '../pages/Admin/ManagerSession';
import ManagerPlayer from '../pages/Admin/ManagerPlayer';
import ManagerTypeShirt from '../pages/Admin/ManagerTypeShirt';
import ManagerShirt from '../pages/Admin/ManagerShirt';
import Shirtdetail from '../components/homepage/Shirtdetail';
import Listshirt from '../pages/User/Listshirt';
import ManagerSize from '../pages/Admin/ManagerSize';
import ManagerShirtSize from '../pages/Admin/ManagerShirtSize';

// Create the router with public and private routes, including the new verify route
// Create the router with public and private routes, including the new verify route
const router = createBrowserRouter([
  {
    path: "/", element: <App />, children: [
      { index: true, element: <HomePage /> }, // Root "/"
      { path: "admin/manager-user", element: <PrivateRoute element={ManagerUser} allowedRoles={[ROLES.ADMIN]} /> },
      { path: "admin/manager-club", element: <PrivateRoute element={ManagerClub} allowedRoles={[ROLES.ADMIN]} /> },
      { path: "admin/manager-session", element: <PrivateRoute element={ManagerSession} allowedRoles={[ROLES.ADMIN]} /> },
      { path: "admin/manager-player", element: <PrivateRoute element={ManagerPlayer} allowedRoles={[ROLES.ADMIN]} /> },
      { path: "admin/manager-size", element: <PrivateRoute element={ManagerSize} allowedRoles={[ROLES.ADMIN]} /> },
      { path: "admin/manager-type-shirt", element: <PrivateRoute element={ManagerTypeShirt} allowedRoles={[ROLES.ADMIN]} />, },
      { path: "admin/manager-shirt", element: <PrivateRoute element={ManagerShirt} allowedRoles={[ROLES.ADMIN]} />, },
      { path: "admin/manager-shirt-size", element: <PrivateRoute element={ManagerShirtSize} allowedRoles={[ROLES.ADMIN]} />, },
      { path: "my-profile", element: <PrivateRoute element={MyProfile} allowedRoles={[ROLES.USER]} /> },
      { path: "setting", element: <PrivateRoute element={SettingUser} allowedRoles={[ROLES.USER, ROLES.STAFF, ROLES.MANAGER]} /> },
      { path: "verifyemail/:id", element: <VerifyAccount /> },
      { path: "shirt-details/:id", element: <Shirtdetail /> },

      { path: "listshirt", element: <Listshirt /> },
      { path: "*", element: <NotFound /> },
    ]
  },
  { path: "/login", element: <Login /> }, // Login page
]);




// The main router component with authentication context
const RouterComponent: React.FC = () => {
  return (
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  );
};

export default RouterComponent;
