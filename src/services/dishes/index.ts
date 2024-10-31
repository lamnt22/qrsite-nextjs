import HttpService from '../http'

class DishesService {
  static url = '/api/dishes'
  static async getListDishes(param?: {}) {
    return await HttpService.httpGet(this.url, param)
  }

  static async getListSearch(param?: {}) {
    return await HttpService.httpGet(this.url + '/search', param)
  }

  static async uploadFileImage(data: any) {
    return await HttpService.httpPost(this.url + '/file', data)
  }

  static async create(data: any) {
    return await HttpService.httpPostFormData(this.url + '/add', data)
  }

  static async detail(id: any) {
    return await HttpService.httpGet(this.url + '/' + id)
  }

  static async update(id: any, data: any) {
    return await HttpService.httpPostFormData(this.url + '/update/' + id, data)
  }
  static async delete(id: any) {
    return await HttpService.httpDelete(this.url + '/delete/' + id)
  }

  static async getAllDishActive() {
    return await HttpService.httpGet(this.url + '/getDishesActive')
  }
    static async convertFileImage(image: any){
        return await HttpService.httpGet(this.url + "/convertImage/"+ image)
    }

}

export default DishesService
