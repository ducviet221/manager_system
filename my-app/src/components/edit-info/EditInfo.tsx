import { completeInfo, getInfoById, updateInfo } from "@/apis/info/info";
import { Button, DatePicker, Form, Input, Modal, Row, message } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLoading } from "../Loading/Loading";
import { EStatus } from "../status/StatusTag.model";

interface IEditInfo {
  isOpenPanel: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentId: string;
}
const EditInfo = ({ isOpenPanel, setIsOpen, currentId }: IEditInfo) => {
  const [editForm] = useForm();
  const { showLoading, closeLoading } = useLoading();
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const handleGetInfoById = async () => {
    try {
      showLoading();
      const { data } = await getInfoById(currentId ?? "");
      const result = data?.result ?? {};
      setIsComplete(result?.status === EStatus.Complete);
      editForm.setFieldsValue({ ...result, date: dayjs(result?.date ?? undefined) });
      closeLoading();
    } catch (e) {
      closeLoading();
      message.error("Lấy thông tin thất bại!");
      console.log(e);
    }
  };

  const handleConfirmInfo = async () => {
    try {
      showLoading();
      await completeInfo(currentId ?? "");
      message.success("Xác nhận thành công!");
      closeLoading();
      setIsOpen(false);
    } catch (e) {
      closeLoading();
      message.error("Xác nhận thất bại!");
      console.log(e);
    }
  };

  useEffect(() => {
    if (isOpenPanel) {
      handleGetInfoById();
    }
  }, [isOpenPanel, currentId]);

  const onFinish = async () => {
    const formValue = editForm.getFieldsValue();
    try {
      showLoading();
      const data = await updateInfo({ ...formValue, id: currentId });

      if (data?.result) {
        message.success("Cập nhật thành công!");
        setIsOpen(false);
      } else {
        message.success("Cập nhật thất bại!");
      }
      closeLoading();
    } catch (e) {
      closeLoading();
      message.error("Cập nhật thất bại!");
      console.log(e);
    }
  };
  return (
    <div>
      <Modal
        title="Chỉnh sửa thông tin"
        onOk={() => editForm.submit()}
        open={isOpenPanel}
        destroyOnClose
        onCancel={() => setIsOpen(false)}
        footer={
          <Row>
            <Button style={{ marginRight: 8 }} onClick={() => setIsOpen(false)}>
              Thoát
            </Button>
            <Button
              type={!isComplete ? "default" : "primary"}
              onClick={() => editForm.submit()}
              style={{ marginRight: 8 }}>
              Lưu
            </Button>
            {!isComplete ? (
              <>
                <Button type="primary" onClick={handleConfirmInfo}>
                  Xác nhận
                </Button>
              </>
            ) : (
              <></>
            )}
          </Row>
        }
        centered>
        <Form
          onFinish={onFinish}
          form={editForm}
          style={{ padding: 16 }}
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
        </Form>
      </Modal>
    </div>
  );
};

export default EditInfo;
