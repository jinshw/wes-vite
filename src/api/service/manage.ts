import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const queryServiceList = (data?: object) => {
  return http.request("post", baseUrlApi("map/data/list"), { data });
};

export const addServiceList = (data?: object) => {
  return http.request("post", baseUrlApi("map/data/add"), { data });
};
export const deleteServiceList = (data?: object) => {
  return http.request("post", baseUrlApi("map/data/delete"), { data });
};

export const updateServiceList = (data?: object) => {
  return http.request("post", baseUrlApi("map/data/update"), { data });
};
