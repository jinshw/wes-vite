import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const mapDataList = (data?: object) => {
    return http.request("post", baseUrlApi("/map/data/list"), { data });
};
export const addMapData = (data?: object) => {
    return http.request("post", baseUrlApi("/map/data/add"), { data });
};
export const deleteMapData = (data?: object) => {
    return http.request("post", baseUrlApi("/map/data/delete"), { data });
};
export const updateMapData = (data?: object) => {
    return http.request("post", baseUrlApi("/map/data/update"), { data });
};
export const fileUpload = (data?: object) => {
    return http.request("post", baseUrlApi("/map/data/fileUpload"), { data });
};
export const fileUploadGetContent = (data?: object) => {
    return http.request("post", baseUrlApi("/map/data/fileUploadGetContent"), { data });
};
export const fileDownLoad = (data?: object) => {
    return http.request("post", baseUrlApi("/map/data/fileDownLoad"), { data });
};
