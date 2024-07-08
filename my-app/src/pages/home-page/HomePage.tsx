import { createInfo, deleteInfoById, getListInfo } from "@/apis/info/info";
import { useLoading } from "@/components/Loading/Loading";
import EditInfo from "@/components/edit-info/EditInfo";
import StatusTag from "@/components/status/Status";
import { EStatus } from "@/components/status/StatusTag.model";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Table,
  TableColumnsType,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import style from "./HomePage.module.scss";
import Header from "./components/header/Header";

const HomePage = () => {
  const [form] = useForm();
  const { showLoading, closeLoading } = useLoading();
  const [currentId, setCurrentId] = useState("");
  const [isOpenPanel, setIsOpenPanel] = useState<boolean>(false);

  const user = sessionStorage.getItem("AuthUser")
    ? JSON.parse(sessionStorage.getItem("AuthUser") ?? "")
    : null;
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLogin(true);
    }
  }, [user, isLogin]);

  const [listInfo, setListInfo] = useState([]);
  const columns: TableColumnsType = [
    {
      dataIndex: "id",
      title: "ID",
      render: (_: any, _blank: any, index) => <div>{index + 1}</div>,
    },
    {
      dataIndex: "cif",
      title: "CIF",
    },
    {
      dataIndex: "name",
      title: "HO TEN",
    },
    {
      dataIndex: "date",
      title: "NGAY THANG",
      render: (value: string) => {
        return <div>{dayjs(value).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      dataIndex: "recive",
      title: "CB NHAN",
    },

    {
      dataIndex: "affarisofficer",
      title: "CB GIAO",
    },
    {
      dataIndex: "deliveryroom",
      title: "PHONG GIAO",
    },
    {
      dataIndex: "status",
      title: "TRANG THAI",
      render: (value: any) => {
        return <StatusTag value={value} />;
      },
    },
    {
      dataIndex: "note",
      title: "GHI CHU",
    },
    {
      dataIndex: "action",
      title: "Action",
      width: 150,
      fixed: "right",
      render: (_: any, record: any) => {
        return (
          <div style={{ minWidth: 120, display: "flex" }}>
            <Button
              disabled={!isLogin}
              style={{
                marginRight: 8,
                width: 40,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <EditOutlined
                onClick={() => {
                  setCurrentId(record?.id ?? "");
                  setIsOpenPanel(true);
                }}
                disabled={!isLogin}
              />
            </Button>
            <Button
              disabled={!isLogin}
              style={{
                width: 40,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Popconfirm
                title="Delete"
                description="Are you sure to delete this record?"
                okText="Yes"
                onConfirm={() => handleDeleteInfo(record?.id ?? "")}
                cancelText="No">
                <DeleteOutlined />
              </Popconfirm>
            </Button>
          </div>
        );
      },
    },
  ];

  const onFinish = async () => {
    const formValue = form.getFieldsValue();
    try {
      showLoading();
      const { data } = await createInfo({ ...formValue, status: EStatus.Pending });
      const { data: listInfo } = await getListInfo();
      setListInfo(listInfo?.result ?? []);
      if (data?.result) {
        message.success("Tạo thành công!");
      } else {
        message.error("Tạo thất bại!");
      }
      closeLoading();
    } catch (e) {
      closeLoading();
      message.error("Tạo thất bại!");
      console.log(e);
    }
  };

  const getListInfoAsync = async () => {
    try {
      showLoading();
      const { data } = await getListInfo();
      setListInfo(data?.result ?? []);
      closeLoading();
    } catch (e) {
      closeLoading();
      console.log(e);
    }
  };

  const handleDeleteInfo = async (id: string) => {
    try {
      showLoading();
      const data = await deleteInfoById(id);
      if (data?.result) {
        message.success("Xóa thành công!");
        await getListInfoAsync();
      } else {
        message.error("Xóa thất bại!");
      }
      closeLoading();
    } catch (e) {
      message.success("Xóa thất bại!");
      closeLoading();
      console.log(e);
    }
  };

  useEffect(() => {
    getListInfoAsync();
  }, [isOpenPanel]);

  return (
    <div>
      <Row style={{ margin: 16 }}>
        <Header setIsLogin={setIsLogin} isLogin={isLogin} user={user} />
      </Row>
      <Row style={{ marginTop: 16 }}>
        <Col lg={10} md={10} sm={24} xs={24}>
          <Form
            onFinish={onFinish}
            form={form}
            style={{ padding: 16 }}
            rootClassName={style.createForm}
            className="flex-column border-2 border-solid">
            <Form.Item label="CIF" name="cif">
              <Input />
            </Form.Item>
            <Form.Item label="Tên khách hàng" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Ngày nhận" name="date">
              <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item label="Cán bộ nhận" name="recive">
              <Input />
            </Form.Item>
            <Form.Item label="Cán bộ giao" name="affarisofficer">
              <Input />
            </Form.Item>
            <Form.Item label="Phòng giao" name="deliveryroom">
              <Input />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <TextArea style={{ resize: "none", height: 120 }} />
            </Form.Item>
            <Row justify="center">
              <Button onClick={() => form.resetFields()} style={{ marginRight: 8 }}>
                Reset
              </Button>
              <Button onClick={() => form.submit()} type="primary">
                Save
              </Button>
            </Row>
          </Form>
        </Col>
        <Col lg={14} md={10} sm={24} xs={24}>
          <Table
            style={{ width: "100%" }}
            scroll={{ x: 1300 }}
            columns={columns}
            dataSource={listInfo}></Table>
        </Col>
      </Row>
      <EditInfo isOpenPanel={isOpenPanel} currentId={currentId} setIsOpen={setIsOpenPanel} />
    </div>
  );
};

export default HomePage;
