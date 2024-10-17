import React, { useState, useEffect } from "react";
import { notification, Typography, Spin } from "antd";
import { verifyUserByIdApi } from "../../util/api";
import { useParams, useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const VerifyAccount: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      handleVerify(parseInt(id, 10));
    }
  }, [id]);

  useEffect(() => {
    if (countdown > 0 && !loading) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0) {
      navigate("/login");
    }
  }, [countdown, loading, navigate]);

  const handleVerify = async (userId: number) => {
    setLoading(true);
    try {
      const result = await verifyUserByIdApi(userId);
      console.log(result);
      notification.success({
        message: "Verification Successful!",
        description: "Your account has been verified.",
      });
    } catch (error) {
      notification.error({
        message: "Verification Failed!",
        description: "An error occurred while verifying the account.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <Title level={2}>Verify Account</Title>
      {id ? (
        <>
          {loading ? (
            <Spin tip="Verifying..." />
          ) : (
            <>
              <Paragraph>
                Successfully verified!
              </Paragraph>
              <Paragraph>
                You will be redirected to the login page in:{" "}
                <strong>{countdown} seconds</strong>.
              </Paragraph>
            </>
          )}
        </>
      ) : (
        <Paragraph>No ID provided in the URL.</Paragraph>
      )}
    </div>
  );
};

export default VerifyAccount;
