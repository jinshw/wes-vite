import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

/** 获取角色列表 */
export const getRoleList = (data?: object) => {
  return http.request("post", baseUrlApi("sysrole/list"), { data });
};

export const getMenuTree = (data?: object) => {
  return http.request("post", baseUrlApi("sysmenu/getTree"), {
    data
  });
};

export const getDeptTree = (data?: object) => {
  return http.request("post", baseUrlApi("sysdept/getTree"), {
    data
  });
};

export const addRole = (data?: object) => {
  return http.request("post", baseUrlApi("sysrole/add"), {
    data
  });
};
export const editRole = (data?: object) => {
  return http.request("post", baseUrlApi("sysrole/edit"), {
    data
  });
};
export const deleteRole = (data?: object) => {
  return http.request("post", baseUrlApi("sysrole/delete"), {
    data
  });
};
