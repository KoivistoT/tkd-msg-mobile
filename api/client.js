import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";
import settings from "../config/settings";

const apiClient = create({
  baseURL: settings.apiUrl,
});

apiClient.addAsyncRequestTransform(async (request) => {
  // const authToken = await authStorage.getToken();
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWMyZDlmNjM3YjVjY2I3MGIyZjQ4NjIiLCJuYW1lIjoiVGltbyBLb2l2aXN0byIsImVtYWlsIjoidGltb25AcG9zdGkuZmkiLCJpYXQiOjE2NDAxNjMzMjR9.h-sPvq6Gn7NIiQzwGSgAfo4kFYxKcUpApELDNL54Mik";
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

export default apiClient;
