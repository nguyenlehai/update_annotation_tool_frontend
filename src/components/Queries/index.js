import { Button, Form, Row, Space, Typography } from "antd";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import querystring from "querystring";
import _ from "lodash";

/**
 *
 * @param {Object} props
 * @param {import("antd").FormInstance} props.queryInstance Sử dụng Form.useForm nếu muốn control query value và query action
 * @param {Function} props.onQuery Sự kiện khi nhấn button Search
 * @param {Number} props.total Tổng số lượng bản ghi lấy từ kết quả của useList
 * @param {import("react").ReactChildren} props.children Mô tả các trường tìm kiếm sử dụng Form.Item
 * @param {boolean} showDetailQuery
 * @returns
 */
const Queries = ({
  queryInstance,
  onQuery,
  total,
  children,
  showDetailQuery,
}) => {
  const [query] = Form.useForm(queryInstance);
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    getURLQuery();
    // eslint-disable-next-line
  }, []);

  const getURLQuery = useCallback(() => {
    const parsedURLSearch = querystring.parse(history.location.search.slice(1));
    if (!parsedURLSearch.query) {
      return;
    }
    const currentQuery = JSON.parse(parsedURLSearch.query);

    query.setFieldsValue(currentQuery);
    typeof onQuery === "function" && onQuery(currentQuery);
    // eslint-disable-next-line
  }, []);

  const onFinish = useCallback(
    (value) => {
      typeof onQuery === "function" && onQuery(_.pickBy(value, _.identity));
    },
    [onQuery]
  );

  return (
    <Form form={query} onFinish={onFinish} layout="vertical">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space wrap={true}>{children}</Space>
        {showDetailQuery && (
          <Row justify="space-between" align="middle">
            <Typography.Text>
              {t("Queries.TotalRecord", { total })
                .replace(/\d+/g, (matchValue) => {
                  console.log();
                  return [`|${matchValue}|`];
                })
                .split("|")
                .map((text, index) => {
                  if (Number(text)) {
                    return (
                      <Typography.Text strong key={index}>
                        {text}
                      </Typography.Text>
                    );
                  }
                  return <Typography.Text key={index}>{text}</Typography.Text>;
                })}
            </Typography.Text>
            <Button type="primary" onClick={query.submit}>
              {t("Search")}
            </Button>
          </Row>
        )}
      </Space>
    </Form>
  );
};

Queries.defaultProps = {
  showDetailQuery: true,
};

export default Queries;
