import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const assetCrossingDataListByPage = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdCrossingData/listByPage"), { data });
};
export const assetCrossingDataList = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdCrossingData/getList"), { data });
};
export const getCrossingDataById = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdCrossingData/getCrossingDataById"), { data });
};
export const addAssetCrossingData = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdCrossingData/add"), { data });
};
export const updateAssetCrossingData = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdCrossingData/update"), { data });
};
export const deleteAssetCrossingData = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdCrossingData/delete"), { data });
};

export const assetAssetRoadListByPage = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdAssetRoad/listByPage"), { data });
};
export const assetAssetRoadList = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdAssetRoad/getList"), { data });
};
export const addAssetRoad = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdAssetRoad/add"), { data });
};
export const updateAssetRoad = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdAssetRoad/update"), { data });
};
export const deleteAssetRoad = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdAssetRoad/delete"), { data });
};

export const assetSectionListByPage = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdAssetSection/listByPage"), { data });
};
export const addAssetSection = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdAssetSection/add"), { data });
};
export const updateAssetSection = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdAssetSection/update"), { data });
};
export const deleteAssetSection = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdAssetSection/delete"), { data });
};

export const trafficPoleListByPage = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficPole/listByPage"), { data });
};
export const trafficPoleList = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficPole/getList"), { data });
};
export const getCrossingDataByPoleId = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficPole/getCrossingDataByPoleId"), { data });
};
export const addTrafficPole = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficPole/add"), { data });
};
export const updateTrafficPole = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficPole/update"), { data });
};
export const deleteTrafficPole = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficPole/delete"), { data });
};
export const getTrafficPoleDataById = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficPole/getTrafficPoleDataById"), { data });
};
export const verifyTrafficPoleCommit = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficPole/verifyTrafficPoleCommit"), { data });
};

export const assetCamerasListByPage = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/cameras/listByPage"), { data });
};
export const updateAssetCameras = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/cameras/update"), { data });
};
export const addAssetCameras = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/cameras/add"), { data });
};
export const deleteAssetCameras = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/cameras/delete"), { data });
};
export const verifyAssetCamerasCommit = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/cameras/verifyAssetCamerasCommit"), { data });
};

export const trafficHldListByPage = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficHld/listByPage"), { data });
};
export const addTrafficHld = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficHld/add"), { data });
};
export const updateTrafficHld = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficHld/update"), { data });
};
export const deleteTrafficHld = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/ibdTrafficHld/delete"), { data });
};

export const changeInfoMarkListByPage = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/changeInfoMark/listByPage"), { data });
};
export const changeInfoMarkList = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/changeInfoMark/getList"), { data });
};
export const getCrossingDataByChangeInfoMarkId = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/changeInfoMark/getCrossingDataByPoleId"), { data });
};
export const addChangeInfoMark = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/changeInfoMark/add"), { data });
};
export const updateChangeInfoMark = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/changeInfoMark/update"), { data });
};
export const deleteChangeInfoMark = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/changeInfoMark/delete"), { data });
};
// export const getTrafficPoleDataById = (data?: object) => {
//     return http.request("post", baseUrlApi("/nt/ibdTrafficPole/getTrafficPoleDataById"), { data });
// };
export const verifyChangeInfoMarkCommit = (data?: object) => {
    return http.request("post", baseUrlApi("/nt/changeInfoMark/verifyChangeInfoMarkCommit"), { data });
};