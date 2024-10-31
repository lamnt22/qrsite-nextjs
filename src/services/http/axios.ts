import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_STATUS } from "src/shared/constants";
import Swal from "sweetalert2";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const onRequest: any = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const accessToken = sessionStorage.getItem("accessToken");
  const site = sessionStorage.getItem("site-manage");
  if (accessToken) {
    config.headers!.Authorization = `Bearer ${accessToken}`;
  }

  if (site) {
    config.headers = { 'Site': site, ...config.headers }
  }

  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error)
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const handleResponseErrorAuth = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("site-manage");
  window.location.href = '/login'
}

const handleResponseErrorPermission = () => {
  window.location.href = '/403';
}

const onResponseError = async (error: any): Promise<any> => {
  const errorResponse = error?.response;

  if (errorResponse && errorResponse.status === API_STATUS.UNAUTHORIZED) {
    handleResponseErrorAuth();
  }

  if (errorResponse && errorResponse.status === API_STATUS.FORBIDDEN) {
    handleResponseErrorPermission();
  }

  if (errorResponse && errorResponse.status === API_STATUS.INTERNAL_SERVER_ERROR) {
    const message = errorResponse?.data?.message;
    Swal.fire({
      title: "INTERNAL SERVER ERROR",
      text: message,
      icon: "error"
    });
  }

  return Promise.reject(error);
}

instance.interceptors.request.use(onRequest, onRequestError);
instance.interceptors.response.use(onResponse, onResponseError);

export default instance;
