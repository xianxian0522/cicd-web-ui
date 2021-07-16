<template>
  <div>
    <CommonBreadcrumb>
      <template v-slot:first>
        <router-link  :to="{ name: 'biz', query: { bizId } }">biz</router-link>
      </template>
      <template v-slot:second>version</template>
    </CommonBreadcrumb>
    <CommonHeader :app-id="appId"/>
ver
  </div>
</template>

<script lang="ts">
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import CommonHeader from "@/components/CommonHeader.vue";
import projectRepositories from "@/composable/projectRepositories";

export default {
  name: "VersionList",
  components: {CommonBreadcrumb, CommonHeader},
  setup() {
    const {appId, bizId} = projectRepositories()

    return {
      appId,
      bizId,
    }
  }
}
</script>

<style scoped lang="less">

</style>
