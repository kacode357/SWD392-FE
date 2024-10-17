import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { getUserByIdApi, updateUserByIdApi } from "../../util/api";
import { Input, Button, Form, message, DatePicker, Select } from "antd";
import FileUploader from "../../util/FileUploader";
import { FormInstance } from "antd/lib/form";
import moment from "moment";

const { Option } = Select;

const Setting: React.FC = () => {
  const { auth } = useContext(AuthContext);
  const [form] = Form.useForm<FormInstance>();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false); // Track image upload state

  // Fetch user data when the component is mounted
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserByIdApi(auth.user.id);
        console.log("userData", userData);
        form.setFieldsValue({
          ...userData,
          dob: userData.dob ? moment(userData.dob) : null,
        });
        setImageUrl(userData.imgUrl);
      } catch (error) {
        message.error("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [auth.user.id, form]);

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      const updatedUser = {
        ...values,
        imgUrl: imageUrl,
        dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
      };
      await updateUserByIdApi(auth.user.id, updatedUser);
      message.success("User updated successfully");
    } catch (error) {
      message.error("Failed to update user.");
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (url: string) => {
    setImageUploading(true); // Start image uploading state
    try {
      setImageUrl(url);
      message.success("Image uploaded successfully");
    } finally {
      setImageUploading(false); // End image uploading state
    }
  };

  return (
    <div><p className="font-bold text-xl">Settings</p>

      {/* Center the avatar */}
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Form.Item label="Profile Picture" style={{ display: "inline-block" }}>
            <FileUploader
              onUploadSuccess={handleImageUpload}
              defaultImage={imageUrl}
            />
          </Form.Item>
        </div>

        <Form.Item
          name="userName"
          label="Username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          name="dob"
          label="Date of Birth"
          rules={[
            { required: true, message: "Please enter your date of birth" },
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select your date of birth"
          />
        </Form.Item>

        <Form.Item name="address" label="Address">
          <Input placeholder="Enter your address" />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Phone Number">
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select your gender" }]}
        >
          <Select placeholder="Select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          {/* Disable button while loading or uploading image */}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={imageUploading}
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'black' }}
          >
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Setting;
