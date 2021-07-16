<template>
  <div>
    {{ appList }}
  </div>
</template>

<script lang="ts">
import {AppStore} from "@/utils/store";
import {ref, toRefs} from "vue";

export default {
  name: "Biz",
  setup() {
    const { appList } = toRefs(AppStore)

    return {
      appList
    }
  }
}
</script>

<style scoped lang="less">

</style>
