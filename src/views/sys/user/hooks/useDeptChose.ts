import { ref } from "vue";
import { getDeptTree } from "@/api/sys/role";
// 部门树
export default function useDeptChose() {
  const deptDialogShow = ref(false);
  const deptTreeData = ref([]);
  const deptTree = ref();
  const defaultExpandKeys = ref([]);
  const defaultProps = {
    children: "children",
    label: "name",
    disabled: function (data, node) {
      if (node.childNodes.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };
  const closeDeptDia = () => {
    deptDialogShow.value = false;
  };
  const getDTree = () => {
    getDeptTree({ deptId: "-1" }).then(({ data }) => {
      deptTreeData.value = data ? [data] : [];
    });
  };
  const getTreeChecked = () => {
    return deptTree.value.getCheckedNodes();
  };
  const nodeCick = item => {
    deptTree.value.setCheckedKeys([item.deptId]);
  };
  const checkChange = (item, node, self) => {
    if (item.children.length === 0) {
      if (node === true) {
        deptTree.value.setCheckedKeys([item.deptId]);
      }
    } else {
      deptTree.value.setChecked(item, false);
    }
  };
  return {
    deptDialogShow,
    closeDeptDia,
    deptTreeData,
    defaultProps,
    getDTree,
    deptTree,
    getTreeChecked,
    defaultExpandKeys,
    nodeCick,
    checkChange
  };
}
