import React, { useState } from 'react';
import { Form, Input,  Select, DatePicker, Row, Col, notification } from 'antd'; 
import { createUserApi } from '../util/api';
import FileUploader from '../util/FileUploader';

const { Option } = Select;

interface RegisterFormValues {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  gender: string;
  dob: any;
  address: string;
  imgUrl?: string;  
}

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [form] = Form.useForm();
  const [imgUrl, setImgUrl] = useState<string>(''); 

  const onFinish = async (values: RegisterFormValues) => {
    const { email, password, name, phone_number, gender, dob, address } = values;
    try {
      const res = await createUserApi({
        email,
        password,
        userName: name,
        phoneNumber: phone_number,
        gender,
        dob: dob ? dob.toISOString() : '', 
        address,
        imgUrl,
      });

      if (res) {
        notification.success({
          message: 'Success',
          description: 'Please verify your email to activate your account',
        });
        onRegisterSuccess();
      }
    } catch (error) {

      notification.error({
        message: 'Error',
        description: 'User not created',
      });
     
     
    }
  };

  return (
    <div className="form-container sign-up mt-5">
      
      <Form
        form={form}
        name="register_form"
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ gender: 'male' }}
      >
            <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h1>

        {/* Avatar Field (Centered) */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Form.Item label="Profile Image" style={{ display: 'inline-block' }}>
            <FileUploader
              onUploadSuccess={(url: string) => setImgUrl(url)} 
              defaultImage=""
            />
          </Form.Item>
        </div>

        {/* Row 1: Email and Name */}
        <Row gutter={16}>
          <Col span={12}>
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
          </Col>

          <Col span={12}>
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 2: Password and Confirm Password */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters long!' },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="confirm_password"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
          </Col>
        </Row>

        {/* Row 3: Phone Number and Gender */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { pattern: /^\d{10}$/, message: 'Please enter a valid phone number!' },
              ]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true, message: 'Please select your gender!' }]}
            >
              <Select placeholder="Select your gender">
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Row 4: Date of Birth and Address */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dob"
              label="Date of Birth"
              rules={[{ required: true, message: 'Please select your date of birth!' }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="Select Date of Birth" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please input your address!' }]}
            >
              <Input placeholder="Address"  />
            </Form.Item>
          </Col>
        </Row>

       <button>  Sign Up</button>
        
       
      </Form>
    </div>
  );
};

export default RegisterForm;
