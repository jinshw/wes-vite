import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const selectAreaCameraList= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryAreaCameraList"), { data });
};
export const selectCameraPreviewUrl= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryCameraPreviewUrl"), { data });
};
export const selectCrossingList= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryCrossingList"), { data });
};
export const selectAreaCameraInFenceList= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryAreaCameraInFenceList"), { data });
};
export const selectAreaCrossingInFenceList= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryAreaCrossingInFenceList"), { data });
};
//视频监控的接口
export const selectAreaCameraCrossingInFenceList= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryAreaCameraCrossingInFenceList"), { data });
};
//预案数据列表
export const selectActplanInfoList= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryActplanInfoList"), { data });
};
export const selectAssetDictListByActplan= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryAssetDictListByActplan"), { data });
};
export const selectAssetDataListByPlanAndDict= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryAssetDataListByPlanAndDict"), { data });
};
export const selectAssetDataDetail= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/queryAssetDataDetail"), { data });
};
export const addAndUpdateActplanAssetData= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/addAndUpdateActplanAssetData"), { data });
};
export const deleteAssetDataById= (data?: object) => {
    return http.request("post", baseUrlApi("nt/dpInteManage/deleteAssetDataById"), { data });
};