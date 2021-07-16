<template>
  <div>
    <CommonBreadcrumb>
      <template v-slot:first>
        <router-link  :to="{ name: 'biz', query: { bizId } }">biz</router-link>
      </template>
      <template v-slot:second>project</template>
    </CommonBreadcrumb>
    <CommonHeader :app-id="appId"/>
pro
  </div>
</template>

<script lang="ts">
import projectRepositories from "@/composable/projectRepositories";
import CommonHeader from "@/components/CommonHeader.vue";
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";

export default {
  name: "ProjectList",
  components: {CommonHeader, CommonBreadcrumb},
  setup() {
    const { projectList, appId, bizId } = projectRepositories()
    console.log(projectList.value)

    return {
      projectList,
      appId,
      bizId,
    }
  }
}
</script>

<style scoped lang="less">

</style>
