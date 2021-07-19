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
export interface ProjectResponse {
  app_display_name?: string;
  app_id?: number;
  app_name?: string;
  base_branch?: string;
  biz_id?: number;
  biz_name?: string;
  branch_name?: string;
  comment?: string;
  create_by_username?: string;
  created_at?: string;
  created_by_user_id?: number;
  edges?: {Artifactory?: string }
  id?: number;
  state?: string;
  task_id?: string;
  template_id?: string;
  Jira?: string;
  updated_at?: string;
  updated_by_user_id?: number;
  updated_by_username?: string;
  version_name?: string;
}
export interface VersionResponse {
  app_id?: number
  app_name?: string;
  biz_id?: number
  biz_name?: string;
  build_number?: number;
  commit_id?: string;
  created_at?: string;
  edges?: {
    Project: ProjectResponse;
  }
  id?: number;
  name?: string;
  updated_at?: string;
}
export interface ProjectWorkflow {
  resolution: ResolutionResponse;
  task: TaskResponse;
}
export interface ResolutionResponse {
  base_configurations: string;
  created: string;
  id: string;
  instance_id: number;
  last_start: string;
  last_stop: string;
  next_retry: string;
  resolver_inputs: string;
  resolver_username: string;
  run_count: number;
  run_max: number;
  state: string;
  steps: {[key: string]: Step};
  task_id: string;
  task_title: string;
}
export interface Comment {
  id: string;
  created: string;
  updated: string;
  content: string;
  username: string;
}
export interface TaskResponse {
  batch: string;
  comments: Comment[];
  created: string;
  errors: string;
  id: string;
  input: {
    [key: string]: any
  };
  last_activity: string;
  last_start: string;
  last_stop: string;
  requester_username: string;
  resolution: string;
  result: {
    [key: string]: any
  };
  state: string;
  steps_done: number;
  steps_total: number;
  tags: {
    [key: string]: string
  };
  template_name: string;
  title: string;
}
export interface Step {
  name: string;
  description: string;
  output: {
    [key: string]: any
  };
  error: string;
  state: string;
  try_count: number;
  max_retries: number;
  last_run: string;
  dependencies: string[];
  foreach_strategy: string;
  tags: {
    [key:string]: string
  };
  children?: any;
}
