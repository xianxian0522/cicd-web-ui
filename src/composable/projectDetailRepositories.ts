import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import cicdRepository from "@/api/cicdRepository";
import {ProjectResponse} from "@/utils/response";


export default function projectDetailRepositories() {
  const route = useRoute()
  const appId = ref(parseInt(route.params.appId as string, 10))
  const projectId = ref(parseInt(route.query.projectId as string, 10))
  const projectInfo = ref<ProjectResponse>()

  const getProjectDetail = async () => {
    try {
      if (appId.value) {
        projectInfo.value = await cicdRepository.queryProjectDetail(projectId.value)
      }
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(getProjectDetail)

  return {
    appId,
    projectId,
    projectInfo,
  }
}
