import Login from "@/components/Login/Login";
import { CreateUser } from "@/pages/create-user/CreateUser";
import { Button, Dropdown, MenuProps, Row } from "antd";
import Modal from "antd/es/modal/Modal";
import React, { useState } from "react";

interface IHeader {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
}

const Header = (props: IHeader) => {
  const { isLogin, setIsLogin, user } = props;
  const [isOpenPanel, setIsOpenPanel] = useState<boolean>(false);
  const [isOpenRegisterPanel, setIsOpenRegisterPanel] = useState<boolean>(false);
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button type="link" onClick={() => setIsOpenRegisterPanel(true)}>
          Đăng ký
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button type="link" onClick={() => setIsOpenPanel(true)}>
          Đăng nhập
        </Button>
      ),
    },
  ];

  return (
    <div>
      {!isLogin ? (
        <Dropdown menu={{ items }} placement="bottom" arrow>
          <Button>Hệ thống</Button>
        </Dropdown>
      ) : (
        <Row style={{ margin: 16 }}>
          <div>Xin chào {user?.username ?? user?.userName ?? ""}</div>
          <Button
            onClick={() => {
              setIsLogin(false);
              sessionStorage.removeItem("AuthUser");
            }}
            style={{ marginLeft: 16 }}>
            Đăng xuất{" "}
          </Button>
        </Row>
      )}
      <Modal
        title="Đăng nhập"
        open={isOpenPanel}
        onCancel={() => setIsOpenPanel(false)}
        footer={<Button onClick={() => setIsOpenPanel(false)}>Cancel</Button>}>
        <Login setIsLogin={setIsLogin} setClosePanel={setIsOpenPanel} />
      </Modal>
      <Modal
        title="Đăng ký"
        open={isOpenRegisterPanel}
        onCancel={() => setIsOpenRegisterPanel(false)}
        footer={<Button onClick={() => setIsOpenRegisterPanel(false)}>Cancel</Button>}>
        <CreateUser />
      </Modal>
    </div>
  );
};

export default Header;
