import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const addMenu = (data?: object) => {
  return http.request("post", baseUrlApi("sysmenu/add"), { data });
};

export const editMenu = (data?: object) => {
  return http.request("post", baseUrlApi("sysmenu/edit"), { data });
};

export const deleteMenu = (data?: object) => {
  return http.request("post", baseUrlApi("sysmenu/delete"), { data });
};
