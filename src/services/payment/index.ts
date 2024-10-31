import HttpService from "../http";

class PaymentDetailService {
    static url = '/api/payment';
    static async getListPaymentDetail(param?: {}){
        return await HttpService.httpGet(this.url, param)
    } 

    static async getListSearch(param?: {}){
        return await HttpService.httpGet(this.url + "/search", param)
    }

    static async create(data: any){
        return await HttpService.httpPost(this.url + "/add", data);
    }

    static async getById(id: any){
        return await HttpService.httpGet(this.url + "/"+ id);
    }

    static async udpate(id: any,data: any){
        return await HttpService.httpPut(this.url + "/update/" + id, data);
    }

    static async getPaymentLatestId(){
        return await HttpService.httpGet(this.url + "/getLatestId");
    }

    static async getDinnerActive(){
        return await HttpService.httpGet("/api/dinner-table/getDinnerTableActive");
    }
}

export default PaymentDetailService;