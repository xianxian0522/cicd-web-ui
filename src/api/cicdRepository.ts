import request from "@/utils/request";
import {
  AppResponse,
  BarItem,
  BaseResponse, JenkinsConsole,
  LoginResponse, Page,
  ProjectResponse, ProjectWorkflow, TicketsResponse,
  VersionResponse,
} from "@/utils/response";

const ApiLogin = '/api/v1/sso/login';
const API = '/api/v1';
const ApiBiz = `${API}/my/biz`
const ApiApp = `${API}/my/app`
const ApiProject = `${API}/my/project`
const ApiTicket = `${API}/my/ticket`

export default {
  login: () => request.get<LoginResponse>(ApiLogin),

  queryAllBiz: () => request.get<BaseResponse[]>(`${ApiBiz}`),
  queryAllAppByBizId: (bizId: number) => request.get<AppResponse[]>(`${ApiBiz}/${bizId}/app`),

  queryAppInfoByAppId: (appId: number) => request.get<AppResponse>(`${ApiApp}/${appId}`),
  queryProjectByAppId: (appId: number) => request.get<ProjectResponse[]>(`${ApiApp}/${appId}/project`),
  queryVersionByAppId: (appId: number) => request.get<VersionResponse[]>(`${ApiApp}/${appId}/version`),
  queryTicketsByAppId: (appId: number, params: any) => request.get<Page<TicketsResponse>>(`${ApiApp}/${appId}/tickets`, params),
  queryTicketOpenCountByAppId: (appId: number, params: any) => request.get(`${ApiApp}/${appId}/ticket_count`, params),
  addProjectByAppId: (appId: number, params: any) => request.post<ProjectResponse>(`${ApiApp}/${appId}/project`, params),

  queryProjectDetail: (projectId: number) => request.get<ProjectResponse>(`${ApiProject}/${projectId}`),
  queryWorkflow: (projectId: number) => request.get<ProjectWorkflow>(`${ApiProject}/${projectId}/workflow`),
  queryTicketsByProId: (projectId: number, params: any) => request.get<Page<TicketsResponse>>(`${ApiProject}/${projectId}/tickets`, params),
  queryTicketOpenCountByProId: (projectId: number, params: any) => request.get(`${ApiProject}/${projectId}/ticket_count`, params),
  workflowRedo: (projectId: number, stepName: string) => request.post(`${ApiProject}/${projectId}/workflow/step/${stepName}/redo`),

  closeTicket: (ticketId: number) => request.put(`${ApiTicket}/${ticketId}/close`),

  confirmProjectWorkflowStep: (projectId: number, stepName: string, Value: string) => request.put(`${ApiProject}/${projectId}/workflow/step/${stepName}/confirm`, {Value}),
  queryJenkinsBuildConsole: (projectId: number, jobName: string, buildNum: string, start: number) => request.get<JenkinsConsole>(`${ApiProject}/${projectId}/jenkins/job/${jobName}/build/${buildNum}/console`, {start}),


  queryProjectStatus: (projectKey: string) => request.get('/api/qualitygates/project_status', {projectKey}),
}
