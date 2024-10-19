// 列格式化
import moment from "moment";
export default function useColFormat() {
  const formatterOptions = (row, column) => {
    const prop = column.property;
    const val = row[prop];
    let result = "";
    switch (prop) {
      case "status":
        result = statusOption(val);
        break;
      case "path":
        result = pathOption(val);
        break;
      case "mainFile":
        result = mainFileOption(val);
        break;
      default:
        result = "";
    }
    return result;
  };
  const statusOption = val => {
    // 状态：1未发布、2已经发布、3 已经废除
    let result = "";
    switch (val) {
      case 1:
        result = "未发布";
        break;
      case 2:
        result = "已经发布";
        break;
      case 3:
        result = "已经废除";
        break;
      default:
        result = "";
    }
    return result;
  };
  const pathOption = val => {
    let result = "";
    if (val == "" || val == null) {
      result = "未上传";
    } else if (val != "") {
      result = "已经上传";
    }
    return result;
  };
  const mainFileOption = val => {
    let result = "";
    if (val == "" || val == null) {
      result = "未上传";
    } else if (val != "") {
      result = "已经上传";
    }
    return result;
  };
  const formatDate = (row, column) => {
    // 获取单元格数据
    const date = row[column.property];
    if (date === undefined || date === null) {
      return "";
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  };
  return {
    formatterOptions,
    formatDate
  };
}
