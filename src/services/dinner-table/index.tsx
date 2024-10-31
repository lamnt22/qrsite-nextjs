import HttpService from "../http";

class TableService {
  static url = '/api/dinner-table/';
  static async getList(params?: {}){
    return await HttpService.httpGet(this.url+"search", params);
  }

  static async create(data: any, params?: {}) {
    return await HttpService.httpPost(this.url + "add", data, params);
  }

  static async detail(id: any) {
    return await HttpService.httpGet(this.url + id);
  }

  static async update(id: any, data: any) {
    return await HttpService.httpPut(this.url + id, data);
  }

  static async delete(id: number) {
    return await HttpService.httpDelete(this.url + id, {});
  }

}

export default TableService;
