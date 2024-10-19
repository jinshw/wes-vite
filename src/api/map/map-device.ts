import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const mapDeviceTypeListByPage = (data?: object) => {
    return http.request("post", baseUrlApi("/map/devicetype/listByPage"), { data });
};
export const mapDeviceTypeList = (data?: object) => {
    return http.request("post", baseUrlApi("/map/devicetype/list"), { data });
};
export const addDeviceType = (data?: object) => {
    return http.request("post", baseUrlApi("/map/devicetype/add"), { data });
};
export const updateDeviceType = (data?: object) => {
    return http.request("post", baseUrlApi("/map/devicetype/update"), { data });
};
export const deleteDeviceType = (data?: object) => {
    return http.request("post", baseUrlApi("/map/devicetype/delete"), { data });
};
export const mapDeviceListByPage = (data?: object) => {
    return http.request("post", baseUrlApi("/map/device/listByPage"), { data });
};
export const selectGltfList = (data?: object) => {
    return http.request("post", baseUrlApi("/map/device/selectGltfList"), { data });
};
export const addDevice = (data?: object) => {
    return http.request("post", baseUrlApi("/map/device/add"), { data });
};
export const updateDevice = (data?: object) => {
    return http.request("post", baseUrlApi("/map/device/update"), { data });
};
export const deleteDevice = (data?: object) => {
    return http.request("post", baseUrlApi("/map/device/delete"), { data });
};
export const deleteSelectedDevice = (data?: object) => {
    return http.request("post", baseUrlApi("/map/device/deleteList"), { data });
};
export const exportExcel = (data?: object) => {
    return http.request("post", baseUrlApi("/map/device/export"), { data });
};
export const fileUpload = (data?: object) => {
    return http.request("post", baseUrlApi("/map/device/fileUpload"), { data });
};
export const mapDeviceListByDeviceType = (data?: object) => {
    return http.request("post", baseUrlApi("/map/device/getDeviceListByDeviceType"), { data });
};

