import {onMounted, ref, watch} from "vue";
import {BaseResponse} from "@/utils/response";
import cicdRepository from "@/api/cicdRepository";
import {AppStore} from "@/utils/store";
import {useRoute, useRouter} from "vue-router";

export default function bizRepositories() {
  const bizId = ref()
  const bizList = ref<BaseResponse[]>([])
  const route = useRoute()
  const router = useRouter()

  const getBizList = async () => {
    try {
      bizList.value = await cicdRepository.queryAllBiz()
      // const id = parseInt(localStorage.getItem('bizId') as string, 10)
      const id = parseInt(route.query.bizId as string, 10)
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
    // if (parseInt(localStorage.getItem('bizId') as string, 10) !== value) {
    //   localStorage.setItem('bizId', value)
    // }
    router.push({
      name: 'biz',
      query: {bizId: value},
    }).then()
    getAppList(value).then()
  })

  return {
    bizId,
    bizList,
  }
}
