import HttpService from "../http";

class CategoryService {

    static url = "/api/category";
    static async getAllCategory (param?: {}) {
        return await HttpService.httpGet(this.url, param);
    }

    static async search(param?: {}) {
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

    static async delete(id: any){
        return await HttpService.httpDelete(this.url + "/delete/"+ id);
    }

    static async getCategorySelected(){
        return await HttpService.httpGet(this.url + "/getCategorySelected");
    }
}

export default CategoryService;