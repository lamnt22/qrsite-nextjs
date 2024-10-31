import axios from './axios';

class HttpService {
  static async httpGet(url: string, params?: {}) {
    return axios.get(url, {
      params: params
    });
  }

  static async httpPost(url: string, data: any, params?: {}) {
    return axios.post(url, data, {
      params: params
    });
  }

  static async httpPostFormData(url: string, data: any) {
    return axios.post(url, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  static async httpPut(url: string, data: any, params?: {}) {
    return axios.put(url, data, {
      params: params
    });
  }

  static async httpPutFormData(url: string, data: any) {
    return axios.put(url, data, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  }

  static async httpDelete(url: string, params?: {}) {
    return axios.delete(url, {
      params: params
    });
  }
}

export default HttpService;
