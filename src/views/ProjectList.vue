<template>
  <div>
    <CommonHeader :app-id="appId"/>
pro
  </div>
</template>

<script lang="ts">
import projectRepositories from "@/composable/projectRepositories";
import CommonHeader from "@/components/CommonHeader.vue";

export default {
  name: "ProjectList",
  components: {CommonHeader},
  setup() {
    const { projectList, appId } = projectRepositories()
    console.log(projectList.value)

    return {
      projectList,
      appId,
    }
  }
}
</script>

<style scoped lang="less">

</style>
