import { AdminLogin } from "src/@core/components/card-statistics/types";
import HttpService from "../http";

class AuthService {
  static async login(data: AdminLogin){
    return await HttpService.httpPost(`/auth/login`, data);
  }
}

export default AuthService;