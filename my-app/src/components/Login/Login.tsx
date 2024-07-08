import { Button, Col, Form, Input, Row, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useLoading } from "../Loading/Loading";
import { login } from "@/apis/login/login";
import React from "react";

interface ILogin {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setClosePanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ setIsLogin, setClosePanel }: ILogin) => {
  const [form] = useForm();
  const { showLoading, closeLoading } = useLoading();

  const onFinish = async (values: any) => {
    try {
      showLoading();
      const data = await login(values);
      if (data.status) {
        sessionStorage.setItem("AuthUser", JSON.stringify(data.result));
        message.success("Đăng nhập thành công!");
        setIsLogin(true);
        setClosePanel(false);
      } else {
        message.error("Tài khoản hoặc mật khẩu không chính xác!");
      }
    } catch (e) {
      console.log(e);
    } finally {
      closeLoading();
    }
  };
  return (
    <Row style={{ margin: 16 }}>
      <Col sm={24}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Tài khoản"
            name="username"
            rules={[
              { required: true, message: "Tên đăng nhập không được để trống!", whitespace: true },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Mật khẩu không được để trống!", whitespace: true },
            ]}>
            <Input type="password" />
          </Form.Item>
          <Row justify="center">
            <Button onClick={() => form.submit()} type="primary">
              Đăng nhập
            </Button>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
