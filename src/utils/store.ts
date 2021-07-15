import {reactive, UnwrapRef} from "vue";
import {AppResponse} from "@/utils/response";

export interface AppState {
  appList: AppResponse[];
}

export const AppStore: UnwrapRef<AppState> = reactive({
  appList: [],
})
