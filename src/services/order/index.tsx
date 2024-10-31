import HttpService from "../http";

class OrderService {
  static url = '/api/order/';

  static urlStaff = '/api/staff/';

  static urlMessage = '/menu-order/';

  static async getListStaff() {
    return await HttpService.httpGet(this.urlStaff + "staffs-active");
  }

  static async create(id: any, data: any,) {
    return await HttpService.httpPost(this.url + id, data);
  }

  static async getList(params?: {}) {
    return await HttpService.httpGet(this.url + "search", params);
  }

  static async detail(id: any) {
    return await HttpService.httpGet(this.url + id);
  }

  static async update(id: any, data: any) {
    return await HttpService.httpPut(this.url + id, data);
  }

  static async updateStatusAndPayment(id: any, data: any) {
    return await HttpService.httpPut(this.url + "updateOrder/" + id, data);
  }

  static async delete(id: number) {
    return await HttpService.httpDelete(this.url + id, {});
  }

  static async getByTableId(params?: {}) {
    return await HttpService.httpGet(this.url + "getOrderByTable", params);
  }

  static async getByPaymentId(params?: {}) {
    return await HttpService.httpGet(this.url + "getOrderByPaymentId", params);
  }
}

export default OrderService;
