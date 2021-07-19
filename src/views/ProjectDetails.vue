<template>
  <div>

  </div>
</template>

<script lang="ts">
import projectDetailRepositories from "@/composable/projectDetailRepositories";

export default {
  name: "ProjectDetails",
  setup() {
    const { appId, projectId, } = projectDetailRepositories()
  }
}
</script>

<style scoped lang="less">

</style>
