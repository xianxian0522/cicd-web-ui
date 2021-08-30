<template>
  <div>
    <a-button @click="goToBack">返回</a-button>
  </div>
</template>

<script lang="ts">
import {useRouter} from "vue-router";

export default {
  name: "SonarQube",
  setup() {
    const router = useRouter()

    const goToBack = () => {
      router.back()
    }

    return {
      goToBack,
    }
  }
}
</script>

<style scoped lang="less">

</style>
