import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import cicdRepository from "@/api/cicdRepository";


export default function projectDetailRepositories() {
  const route = useRoute()
  const appId = ref(parseInt(route.params.appId as string, 10))
  const projectId = ref(parseInt(route.query.projectId as string, 10))

  const getProjectDetail = async () => {
    try {
      if (appId.value) {
        await cicdRepository.queryProjectDetail(projectId.value)
      }
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(getProjectDetail)

  return {
    appId,
    projectId,
  }
}
