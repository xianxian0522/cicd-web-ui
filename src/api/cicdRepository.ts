import request from "@/utils/request";
import {BarItem, LoginResponse} from "@/utils/response";

const API = '/api/v1/my';
const ApiLogin = '/api/v1/sso/login';
let ApiBar = '/api/my/bar';

export default {
  queryBar: () => request.get<BarItem[]>(ApiBar),
  login: () => request.get<LoginResponse>(ApiLogin),
}
