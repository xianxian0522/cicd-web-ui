import request from "@/utils/request";
import {AppResponse, BarItem, BaseResponse, LoginResponse, ProjectResponse, VersionResponse} from "@/utils/response";

const ApiLogin = '/api/v1/sso/login';
const API = '/api/v1/';
const ApiBiz = `${API}/my/biz`
const ApiApp = `${API}/my/app`

let ApiBar = '/api/my/bar';
if (window.location.hostname.endsWith('dev.ops.sumscope.com')) {
  ApiBar = 'http://menu.dev.ops.sumscope.com:3000' + ApiBar;
} else if (window.location.hostname.endsWith('ops.sumscope.com')) {
  ApiBar = 'http://menu.ops.sumscope.com' + ApiBar;
}

export default {
  queryBar: () => request.get<BarItem[]>(ApiBar),
  login: () => request.get<LoginResponse>(ApiLogin),

  queryAllBiz: () => request.get<BaseResponse[]>(`${ApiBiz}`),
  queryAllAppByBizId: (bizId: number) => request.get<AppResponse[]>(`${ApiBiz}/${bizId}/app`),

  queryAppInfoByAppId: (appId: number) => request.get<AppResponse>(`${ApiApp}/${appId}`),
  queryProjectByAppId: (appId: number) => request.get<ProjectResponse[]>(`${ApiApp}/${appId}/project`),
  queryVersionByAppId: (appId: number) => request.get<VersionResponse[]>(`${ApiApp}/${appId}/version`),
  addProjectByAppId: (appId: number, params: any) => request.post(`${ApiApp}/${appId}/project`, params),
}
