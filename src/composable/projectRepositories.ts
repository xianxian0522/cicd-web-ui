import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import cicdRepository from "@/api/cicdRepository";
import { ProjectResponse} from "@/utils/response";

export default function projectRepositories() {
  const route = useRoute()
  const appId = ref(parseInt(route.params.appId as string, 10))
  const bizId = ref(parseInt(route.params.bizId as string, 10))
  const projectList = ref<ProjectResponse[]>([])

  const getProject = async () => {
    try {
      if (appId.value) {
        projectList.value = await cicdRepository.queryProjectByAppId(appId.value)
      }
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(() => {
    getProject().then()
  })

  return {
    appId,
    bizId,
    projectList,
  }

}
