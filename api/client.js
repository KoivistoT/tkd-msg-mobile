import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";
import settings from "../config/settings";

import { getToken } from "../store/currentUser";
const apiClient = create({
  baseURL: settings.apiUrl,
});

apiClient.addAsyncRequestTransform(async (request) => {
  // const authToken = await authStorage.getToken();
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWQzNWI2YTQ1ZDFlM2UyYmM4M2ZmMDgiLCJuYW1lIjoiVGltbyBLb2l2aXN0byIsImVtYWlsIjoidGltb25AcG9zdGkuZmkiLCJpYXQiOjE2NDE1ODkyMjh9.eQ9yx4_wez_lXoEiXDwdJn_xSqUW-34qZbOsNXwTXJs";

  // const authToken = request.token;
  // console.log(store.dispatch(getToken(store.getState())));

  if (!authToken) return;
  request.headers["x-auth-token"] = authToken;
});

const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

const post = apiClient.post;
apiClient.post = async (url, params, axiosConfig) => {
  const response = await post(url, params, axiosConfig);

  if (response.ok) {
    cache.store(url, response.data);
    return response;
  }

  const data = await cache.get(url);
  return data ? { ok: true, data } : response;
};

export default apiClient;
