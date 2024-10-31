import HttpService from "../http";

class StaffService {

    static url = "/api/staff";
    static async getAllStaffs (param?: {}) {
        return await HttpService.httpGet(this.url, param);
    }

    static async searchStaff(param?: {}) {
        return await HttpService.httpGet(this.url + "/search", param);
    }  
    static async create(data: any) {
        return await HttpService.httpPost(this.url + '/add', data)
    }

    static async detail(id: any) {
        return await HttpService.httpGet(this.url + '/' + id)
    }

    static async update(id: any, data: any) {
        return await HttpService.httpPut(this.url + '/update/' + id, data)
    }

    static async deleteStaff(id: any){
        return await HttpService.httpDelete(this.url + "/delete/"+ id);
    }
}

export default StaffService;