import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const getUserList = (data?: object) => {
  return http.request("post", baseUrlApi("sysuser/listPage"), { data });
};

export const addUser = (data?: object) => {
  return http.request("post", baseUrlApi("sysuser/adduser"), { data });
};

export const delUser = (data?: object) => {
  return http.request("post", baseUrlApi("sysuser/delete"), { data });
};

export const editUser = (data?: object) => {
  return http.request("post", baseUrlApi("sysuser/edit"), { data });
};

export const resetUserPassword = (data?: object) => {
  return http.request("post", baseUrlApi("sysuser/resetPassword"), { data });
};
