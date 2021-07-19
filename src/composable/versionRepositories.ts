import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import cicdRepository from "@/api/cicdRepository";
import {VersionResponse} from "@/utils/response";


export default function versionRepositories() {
  const route = useRoute()
  const appId = ref(parseInt(route.params.appId as string, 10))
  const bizId = ref(parseInt(route.params.bizId as string, 10))
  const versionList = ref<VersionResponse[]>([])

  const getVersion = async () => {
    try {
      if (appId.value) {
         versionList.value = await cicdRepository.queryVersionByAppId(appId.value)
      }
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(() => {
    getVersion().then()
  })

  return {
    appId,
    bizId,
    versionList,
  }

}
