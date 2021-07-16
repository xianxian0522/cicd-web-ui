import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {AppResponse} from "@/utils/response";
import cicdRepository from "@/api/cicdRepository";

export default function appInfoRepositories() {
  const route = useRoute()
  const appId = ref(parseInt(route.params.appId as string, 10))
  const appInfo = ref<AppResponse>()

  const getAppInfo = async () => {
    try {
      if (appId.value) {
        appInfo.value = await cicdRepository.queryAppInfoByAppId(appId.value)
      }
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(getAppInfo)

  return {
    appInfo,
  }
}
