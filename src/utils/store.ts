import {reactive, UnwrapRef} from "vue";
import {AppResponse, BaseResponse} from "@/utils/response";

export interface AppState {
  appList: AppResponse[];
  bizInfo: BaseResponse;
}

export const AppStore: UnwrapRef<AppState> = reactive({
  appList: [],
  bizInfo: {},
})

export const taskStates: {[key: string]: string} = {
  DONE: '#28a745',
  TODO: '#aaa',
  RUNNING: '#32acff',
  EXPANDED: '#32acff',
  BLOCKED: '#ff9803',
  TO_RETRY: '#ff9803',
  AFTERRUN_ERROR: '#ff9803',
  CLIENT_ERROR: '#b04020',
  FATAL_ERROR: '#b04020',
  SERVER_ERROR: '#b04020',
  PRUNE: '#ddd',
}
