import PolicyRoute from "components/PolicyRoute";
import {ROUTES} from "configs";
import {useTranslation} from "react-i18next";
import Layout, {Content} from "antd/es/layout/layout";
import {Button, Select, Table} from "antd";
import "./styles.css";
import {CSVLink} from "react-csv";
import {useEffect, useState} from "react";
import Axios from "axios";

const asyncLoadData = async () => {
  const response = await Axios.get("http://localhost:5000/get");
  const data = response.data.results;

  return data.map((item, i) => {
    return {
      key: i,
      "id": item.id,
      "idName": item.id_name,
      "bookName": item.book_name,
      "oldFilename": item.old_filename,
      "newFilename": item.new_filename,
      "lawName": item.law_name,
      "fileName": item.file_name,
      "articleID": item.article_id,
      "paragraph": item.paragraph,
      "decreeInvisible": item.decree_invisible,
      "label": item.label
    };
  });
};

const Home = () => {
  const {t} = useTranslation(["HomePage"]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  let arrBookNames = [];
  let countLabelInputed = 0;
  const csvData = [
    ["ID", "Book Name", "旧ファイル名(Old filename)", "新ファイル名 (New filename)", "Law Name",
      "File Name", "条数 (Article ID)", "QAの段落 (Paragraph)", "法令の条文（見え消し）", "Label"],
  ];

  if (data && data.length) {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      csvData.push(
        [data[i].idName, data[i].bookName, data[i].oldFilename, data[i].newFilename, data[i].lawName, data[i].fileName,
          data[i].articleID, data[i].paragraph, data[i].decreeInvisible, data[i].label]
      );
      arr.push(data[i].bookName);
      if (data[i].label !== null) {
        countLabelInputed++;
      }
    }
    arrBookNames = [...new Set(arr)];
  }

  const columns = [
    {
      title: t("Form.IdName"),
      dataIndex: "idName",
      width: 50,
    },
    {
      title: t("Form.BookName"),
      dataIndex: "bookName",
      width: 60,
      filters: arrBookNames.map(book => (
        {
          text: book,
          value: book,
        }
      )),
      onFilter: (value, record) => record.bookName.indexOf(value) === 0
    },
    {
      title: t("Form.OldFilename"),
      dataIndex: "oldFilename",
      width: 95,
    },
    {
      title: t("Form.NewFilename"),
      dataIndex: "newFilename",
      width: 80,
    },
    {
      title: t("Form.LawName"),
      dataIndex: "lawName",
      width: 70,
    },
    {
      title: t("Form.FileName"),
      dataIndex: "fileName",
      width: 70,
    },
    {
      title: t("Form.ArticleID"),
      dataIndex: "articleID",
      width: 80,
    },
    {
      title: t("Form.Paragraph"),
      dataIndex: "paragraph",
      width: 290,
      render: (data) => (
        <div dangerouslySetInnerHTML={{__html: data}}/>
      ),
    },
    {
      title: t("Form.DecreeInvisible"),
      dataIndex: "decreeInvisible",
      render: (data) => (
        <div dangerouslySetInnerHTML={{__html: data}}/>
      ),
      width: 290
    },
    {
      title: t("Form.Label"),
      dataIndex: "label",
      width: 120,
      render: (data, record) => (
        <Select
          placeholder="Choose Label"
          optionFilterProp="Select.Option"
          value={data}
          loading={loading ? loading : ""}
          onChange={(value) => changeLabel(record.id, value)}
        >
          <Select.Option value="0">0</Select.Option>
          <Select.Option value="1">1</Select.Option>
        </Select>
      )
    }
  ];

  async function changeLabel(id, value) {
    setLoading(true);
    try {
      await Axios.patch("http://localhost:5000/update", {
        id,
        "label": parseInt(value)
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setData(await asyncLoadData());
  }

  useEffect(() => {
    asyncLoadData().then(setData);
  }, []);

  return (
    <Layout>
      <Content>
        <div style={{textAlign: "center", paddingTop: "1%", fontSize: "30px"}}><b>{t("TitlePage")}</b></div>
        <h1>Done {countLabelInputed}/{Object.keys(data).length} ({(100 * countLabelInputed / Object.keys(data).length).toFixed(1)}%)</h1>
        <Table columns={columns} dataSource={data} size="middle" scroll={{y: 550}} bordered style={{paddingTop: "1%"}}/>
        <Button type="primary" shape="round">
          <CSVLink data={csvData} filename={"exportCsvData.csv"} className="btn btn-primary">Download CSV</CSVLink>
        </Button>
      </Content>
    </Layout>
  );
};

const Page = () => <
  PolicyRoute
  exact
  path={ROUTES.HOME}
  component={Home}
/>;

export default Page;
