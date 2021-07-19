<template>
  <div class="project-detail">
    <CommonHeader :app-id="appId" />
    <a-descriptions title="项目详情" bordered>
      <a-descriptions-item label="基本分支">{{ projectInfo?.base_branch }}</a-descriptions-item>
      <a-descriptions-item label="分支名">{{ projectInfo?.branch_name }}</a-descriptions-item>
      <a-descriptions-item label="comment">{{ projectInfo?.comment }}</a-descriptions-item>
      <a-descriptions-item label="版本名">{{ projectInfo?.version_name }}</a-descriptions-item>
      <a-descriptions-item label="创建人" :span="2">{{ projectInfo?.create_by_username }}</a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script lang="ts">
import CommonHeader from "@/components/CommonHeader.vue";
import projectDetailRepositories from "@/composable/projectDetailRepositories";

export default {
  name: "ProjectDetails",
  components: { CommonHeader },
  setup() {
    const { appId, projectId, projectInfo } = projectDetailRepositories()

    return {
      appId,
      projectInfo,
    }
  }
}
</script>

<style scoped lang="less">
.project-detail {
  padding-top: 20px;
}
</style>
