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
