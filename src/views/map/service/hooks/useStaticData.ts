// 静态数据
export default function useStaticData() {
  const dataTypeOptions = [
    { code: "obj", name: "obj" },
    { code: "geojson", name: "geojson" },
    { code: "xodr", name: "xodr" },
    { code: "gltf", name: "gltf" },
    { code: "shape", name: "shape" },
    { code: "xml", name: "xml" },
    { code: "json", name: "json" },
    { code: "xa_json", name: "xa_json" }
  ];
  const statusOption = [
    { code: 1, name: "未发布" },
    { code: 2, name: "已经发布" },
    { code: 3, name: "已经废除" }
  ];
  const rules = {
    dataName: [
      { required: true, message: "请输数据名称", trigger: "blur" },
      {
        min: 3,
        max: 50,
        message: "长度在3 到 30 个字符",
        trigger: ["blur", "change"]
      }
    ],
    code: [{ required: true, message: "请输编码", trigger: "blur" }],
    version: [{ required: true, message: "请输入版本号", trigger: "blur" }]
  };
  return {
    dataTypeOptions,
    statusOption,
    rules
  };
}
