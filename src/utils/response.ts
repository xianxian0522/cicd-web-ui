export interface BarItem {
  id: number;
  icon?: string;
  path: string;
  name: string;
  route?: string;
  children?: BarItem[];
}
export interface JwtTokenResponse {
  accessToken: string;
  email: string;
  id: number;
  mobile: string;
  name: string;
  username: string;
}
export interface LoginResponse {
  url?: string;
  token?: string;
}
export interface BaseResponse {
  Comment?: string;
  CreatedAt?: string;
  DisplayName?: string;
  ID?: number;
  Name?: string;
  UpdatedAt?: string;
}
export interface AppResponse extends BaseResponse{
  InstanceTemplate?: InstanceTemplate;
  Level?: string;
  ReleaseInfo?: ReleaseInfo;
}
export interface ReleaseInfo {
  RepoName: string;
  ProjectName: string;
  PackageName: string;
}
export interface InstanceTemplate {
  BindInfos?: BindInfos[];
  DataDir?: string;
  EnvVars: EnvVars[];
  LogDir?: string;
  MetricEndpoint?: string;
  User?: string;
  WorkDir?: string;
}
export interface EnvVars {
  Name: string;
  Value: string;
}
export interface BindInfos {
  Ip: string;
  Name: string;
  Port: number;
  Protocol: string;
}
