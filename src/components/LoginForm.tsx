import React, { useContext, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCurrentLogin, loginUserApi } from '../util/api';
import { AuthContext } from '../context/auth.context';
import logo from '../assets/logo1.jfif';

import GoogleLoginButton from './GoogleLoginButton'; // Import the new GoogleLoginButton component

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // Trạng thái loading cho nút Sign In

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true); // Bật loading khi bắt đầu gọi API
    const { email, password } = values;
    const data = { email, password };

    const resDataToken = await loginUserApi(data);
    if (resDataToken) {
      localStorage.setItem('token', resDataToken.token);

      const resDataLogin = await getCurrentLogin();
      console.log(resDataLogin);

      notification.success({
        message: 'Successful',
        description: 'You have successfully logged in.',
      });

      setAuth({
        isAuthenticated: true,
        user: {
          id: resDataLogin?.id,
          imgUrl: resDataLogin?.imgUrl,
          email: resDataLogin?.email,
          name: resDataLogin?.name,
          role: resDataLogin?.role,
        },
      });

      // Redirect based on role
      if (resDataLogin?.roleName === 'Admin') {
        console.log('Admin');
        window.location.href = '/admin/manager-user';
        return;
      } else {
        navigate('/');
        return;
      }
    } else {
      notification.error({
        message: 'Error',
        description: resDataToken.EM || 'Something went wrong!',
      });
    }

    setLoading(false); // Tắt loading sau khi API hoàn thành
  };

  return (
    <div className="form-container sign-in px-5">
      <Form<LoginFormValues> name="login_form" onFinish={onFinish} layout="vertical">
        <img src={logo} className="w-full" alt="" />
        <h1 className="font-bold text-2xl ">Sign In</h1>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Button
          className='button'
          type="primary"
          htmlType="submit"
          loading={loading} // Sử dụng trạng thái loading cho nút Sign In
          block
        >
          Sign In
        </Button>
        <div className="separator flex items-center py-2">
          <hr className="flex-grow border-gray-300" />
          <span className=" text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className='flex justify-center '>
          <GoogleLoginButton />
        </div>
        <div className="text-center mt-2">
          <button className="text-blue-500 hover:underline" onClick={() => (window.location.href = '/')}>
            Back to HomePage
          </button>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
