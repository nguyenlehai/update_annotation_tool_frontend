import { Layout, Spin } from "antd";
import "./styles.less";

const SuspenseFallback = () => (
  <Layout className="fallback">
    <Layout.Content className="spin_center">
      <Spin />
    </Layout.Content>
  </Layout>
);

export default SuspenseFallback;
