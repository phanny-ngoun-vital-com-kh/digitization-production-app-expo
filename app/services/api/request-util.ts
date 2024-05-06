import { Api } from "./api"
import { AxiosRequestConfig } from "axios"
import { ApiResponse, HEADERS } from "apisauce"
import { Page } from "./api.types"

export interface IRequestService {
  header: () => HEADERS;
  api: Api;
  fetch: <T, U = T>(
    actionName: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T, U>>
  exec: <T, U = T>(
    actionName: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T, U>>
  list: <T>(
    actionName: string,
    data?: any,
    axiosConfig?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T[]>>
  page: <T>(
    actionName: string,
    data?: any,
    pageSize?: number,
    axiosConfig?: AxiosRequestConfig,
  ) => Promise<ApiResponse<Page<T>>>
  uploadFile: <T, U>(
    filePath: string,
    fileName: string,
    fileId?: string,
    axiosConfig?: AxiosRequestConfig,
  ) => Promise<ApiResponse<T, U>>
}



export const RequestService = (api: Api,service:string='prod'): IRequestService => ({

  header: () => api.apisauce.headers,
  api: api,
  fetch: async <T, U = T>(actionName: string, data?: any, axiosConfig?: AxiosRequestConfig) => {
    try {
      api.waiting?.(true)
      return await api.apisauce.post<T, U>(
        `/services/${service}/api/name/${actionName}/find`,
        data,
        axiosConfig);
    } finally {
      api.waiting?.(false);
    }
  },

  list: async <T>(actionName: string, data?: any, axiosConfig?: AxiosRequestConfig) => {
    api.waiting?.(true)
    try {
      return await api.apisauce.post<T>(`/services/${service}/api/name/${actionName}/list`, data, axiosConfig);
    } finally {
      api.waiting?.(false);
    }
  },

  page: async <T>(actionName: string, data?: any, pageSize?: number, axiosConfig?: AxiosRequestConfig) => {
    api.waiting?.(true)
    try {
      return await api.apisauce.post<Page<T>>(
        `/services/${service}/api/name/${actionName}/list-paging/page/0/size/${pageSize || 20}`,
        data,
        axiosConfig);
    } finally {
      api.waiting?.(false);
    }
  },

  exec: async <T, U = T>(actionName: string, data?: any, axiosConfig?: AxiosRequestConfig) => {
    api.waiting?.(true)
    try {
      return await api.apisauce.post<T, U>(
        `/services/${service}/api/name/${actionName}/exec`,
        data,
        axiosConfig);
    } finally {
      api.waiting?.(false);
    }
  },

  uploadFile: <T, U>(
    filePath: string,
    fileName: string,
    fileId?: string,
  ) => {
    const formData = new FormData()
    const file = {
      uri: filePath,
      type: "image/jpg",
      name: fileName,
    }
    formData.append("file", file as any)
    fileId && formData.append("fileId", fileId)

    api.waiting?.(true)
    return api.apisauce.post<T, U>(
      "/services/files/api/upload",
      formData,
      {
        headers: {
          "Accept": "application/json",
          "Content-Type": "multipart/form-data;",
        },
      },
    ).finally(() => {
      api.waiting?.(false);
    })
  },
})
