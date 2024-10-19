import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const getDicts = (data?: object) => {
  return http.request("post", baseUrlApi("sysdict/list"), { data });
};

export const addDict = (data?: object) => {
  return http.request("post", baseUrlApi("sysdict/add"), { data });
};

export const editDict = (data?: object) => {
  return http.request("post", baseUrlApi("sysdict/edit"), { data });
};

export const deleteDict = (data?: object) => {
  return http.request("post", baseUrlApi("sysdict/delete"), { data });
};
