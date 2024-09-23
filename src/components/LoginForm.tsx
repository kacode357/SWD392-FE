import React, { useContext } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getCurrentLogin, loginUserApi } from '../util/api';
import { AuthContext } from '../context/auth.context';
import todoLogo from '../assets/todoList.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const onFinish = async (values: LoginFormValues) => {
    const { email, password } = values;
    const data = { email, password };

    const resDataToken = await loginUserApi(data);
    console.log(resDataToken);
    if (resDataToken) {
     

      const resDataLogin = await getCurrentLogin();
      console.log(resDataLogin);

      notification.success({
        message: 'Successful',
        description: 'You have successfully logged in.',
      });

      setAuth({
        isAuthenticated: true,
        user: {
          email: resDataLogin?.email,
          name: resDataLogin?.name,
          role: resDataLogin?.role,
        },
      });

      // Redirect based on role
      if (resDataLogin?.role === 'admin') {
        navigate('/manager-user');
      } else {
        navigate('/');
      }
    } else {
      notification.error({
        message: 'Error',
        description: resDataToken.EM || 'Something went wrong!',
      });
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    // Xử lý thành công khi nhận được Google token
    const token = response.credential;
    console.log('Google Token:', token);

    // Gọi API với token từ Google
    // const resDataToken = await loginUserApi({ googleToken: token });
    const resDataToken = "await loginUserApi({ googleToken: token })";
    if (resDataToken) {
      // localStorage.setItem('token', resDataToken.token);

      const resDataLogin = await getCurrentLogin();
      setAuth({
        isAuthenticated: true,
        user: {
          email: resDataLogin?.email,
          name: resDataLogin?.name,
          role: resDataLogin?.role,
        },
      });
      navigate('/');
    } else {
      notification.error({
        message: 'Error',
        description: 'Google login failed!',
      });
    }
  };

  const handleGoogleFailure = () => {
    notification.error({
      message: 'Error',
      description: 'Google login failed!',
    });
  };
  

  return (
    <GoogleOAuthProvider clientId="405029644705-pgg82nbc7r3uq9igpnj3vkk1ku524b0o.apps.googleusercontent.com">
      <div className="form-container sign-in">
        <Form<LoginFormValues> name="login_form" onFinish={onFinish} layout="vertical">
          <img src={todoLogo} className="w-fullw-40 h-auto mx-auto mt-20" alt="" />
          <h1 className="font-bold text-2xl">Sign In</h1>
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
          <Button type="primary" htmlType="submit" block>
            Sign In
          </Button>

          <div style={{ marginTop: '16px' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </div>

          <div className="text-center mt-4">
            <button className="text-blue-500 hover:underline" onClick={() => (window.location.href = '/')}>
              Back to HomePage
            </button>
          </div>
        </Form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginForm;
