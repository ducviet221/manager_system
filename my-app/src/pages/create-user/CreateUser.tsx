import { createUser } from "@/apis/login/login";
import { useLoading } from "@/components/Loading/Loading";
import { Button, Col, Form, Input, Row, message } from "antd";
import { useForm } from "antd/es/form/Form";

export const CreateUser = () => {
  const [form] = useForm();
  const { showLoading, closeLoading } = useLoading();

  const onFinish = async (values: any) => {
    try {
      showLoading();
      const { data } = await createUser(values);

      if (data?.status) {
        message.success("Tạo tài khoản thành công!");
      } else {
        message.error("Tạo tài khoản thất bại!");
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
              Đăng ký
            </Button>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};
