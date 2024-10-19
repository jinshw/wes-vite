import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const addDept = (data?: object) => {
  return http.request("post", baseUrlApi("sysdept/add"), { data });
};

export const editDept = (data?: object) => {
  return http.request("post", baseUrlApi("sysdept/edit"), { data });
};

export const deleteDept = (data?: object) => {
  return http.request("post", baseUrlApi("sysdept/delete"), { data });
};
