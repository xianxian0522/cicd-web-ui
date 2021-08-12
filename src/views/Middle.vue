<template>
  <div>
  </div>
</template>

<script lang="ts">
import cicdRepository from "@/api/cicdRepository";
import {useRouter} from "vue-router";
import tokenRepositories from "@/composable/tokenRepositories";

export default {
  name: 'Middle',
  setup() {
    const router = useRouter()
    const token = localStorage.getItem('token')

    const login = async () => {
      const data = await cicdRepository.login()
      if (data?.token) {
        tokenRepositories(data?.token)
      }
    }

    if (!token) {
      login()
    } else {
      router.push({name: 'biz'})
    }
  }
}
</script>

<style lang="less">

</style>
