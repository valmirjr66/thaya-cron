import axios, { type AxiosRequestConfig } from "axios";
import { Agent } from "https";

const axiosInstance = axios.create({
  httpsAgent: new Agent({ rejectUnauthorized: false }),
});

const httpCallers = {
  get: async (path: string, config?: AxiosRequestConfig) => {
    return await axiosInstance.get(path, config);
  },
  post: async <T>(path: string, data?: T, config?: AxiosRequestConfig) => {
    return await axiosInstance.post(path, data, config);
  },
  put: async <T>(path: string, data?: T, config?: AxiosRequestConfig) => {
    return await axiosInstance.put(path, data, config);
  },
  patch: async <T>(path: string, data?: T, config?: AxiosRequestConfig) => {
    return await axiosInstance.patch(path, data, config);
  },
  delete: async (path: string, config?: AxiosRequestConfig) => {
    return await axiosInstance.delete(path, config);
  },
};

export default httpCallers;
