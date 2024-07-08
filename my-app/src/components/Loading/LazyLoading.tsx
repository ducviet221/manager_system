import { Row, Spin } from "antd";
import style from "./LazyLoading.module.scss";

const LazyLoading = () => {
  return (
    <div className={style.loadingWrapper}>
      <Row align="middle" justify="center" style={{ height: "100%" }}>
        <Spin size="large">
          <div className="content" />
        </Spin>
      </Row>
    </div>
  );
};

export default LazyLoading;
