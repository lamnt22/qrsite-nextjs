import HttpService from "../http";

class MenuOrderService {
  static url = '/menu-order/';

  static async create(id: any, data: any,) {
    return await HttpService.httpPost(this.url + id, data);
  }

  static async sendMessage(data: any) {
    return await HttpService.httpPost(this.url + "send-message", data);
  }

}

export default MenuOrderService;
