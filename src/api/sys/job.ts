import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export const queryjob = (data) => {
  return http.request("post", baseUrlApi("job/queryjob"), { data });
};
export const addjob = (data) => {
  return http.request("post", baseUrlApi("job/addjob"), { data });
};
export const pausejob = (data) => {
  return http.request("post", baseUrlApi("job/pausejob"), { data });
};
export const resumejob = (data) => {
  return http.request("post", baseUrlApi("job/resumejob"), { data });
};
export const deletejob = (data) => {
  return http.request("post", baseUrlApi("job/deletejob"), { data });
};
export const reschedulejob = (data) => {
  return http.request("post", baseUrlApi("job/reschedulejob"), { data });
};


