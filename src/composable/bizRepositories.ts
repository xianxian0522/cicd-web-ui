import {onMounted, ref, watch} from "vue";
import {BaseResponse} from "@/utils/response";
import cicdRepository from "@/api/cicdRepository";
import {AppStore} from "@/utils/store";

export default function bizRepositories() {
  const bizId = ref()
  const bizList = ref<BaseResponse[]>([])

  const getBizList = async () => {
    try {
      bizList.value = await cicdRepository.queryAllBiz()
      const id = parseInt(localStorage.getItem('bizId') as string, 10)
      if (!id) {
        bizId.value = bizList.value?.[0].ID
      } else {
        bizId.value = id
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getAppList = async (bizId: number) => {
    try {
      AppStore.appList = await cicdRepository.queryAllAppByBizId(bizId)
    } catch (e) {
      console.error(e)
    }
  }

  onMounted(getBizList)
  watch(bizId, value => {
    getAppList(value).then()
  })

  return {
    bizId,
    bizList,
  }
}
