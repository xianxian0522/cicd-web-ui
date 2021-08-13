<template>
  <div>
    <CommonBreadcrumb>
      <template v-slot:first>
        <router-link  :to="{ name: 'biz', query: { bizId } }">biz</router-link>
      </template>
      <template v-slot:second>project</template>
    </CommonBreadcrumb>
    <CommonHeader :app-id="appId"/>
    <CommonTicket :app-id="appId" :isAppTicket="true"/>
    <CommonTable :columns="columns" :data-source="projectList" :scroll-x="'1800px'">
      <template v-slot:default="slotProps">
        <a-button type="link" >
          <router-link :to="{name: 'project-detail', query: {projectId: slotProps.action.id}, params: {appId}}">项目详情</router-link>
        </a-button>
      </template>
    </CommonTable>
  </div>
</template>

<script lang="ts">
import projectRepositories from "@/composable/projectRepositories";
import CommonHeader from "@/components/CommonHeader.vue";
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import CommonTable from "@/components/CommonTable.vue";
import CommonTicket from "@/components/CommonTicket.vue";

export default {
  name: "ProjectList",
  components: {
    CommonHeader,
    CommonBreadcrumb,
    CommonTable,
    CommonTicket,
  },
  setup() {
    const columns = [
      { dataIndex: 'version_name', key: 'version_name', title: '版本名', fixed: 'left', width: 180},
      { dataIndex: 'base_branch', key: 'base_branch', title: '基本分支',},
      { dataIndex: 'branch_name', key: 'branch_name', title: '分支名',},
      { dataIndex: 'state', key: 'state', title: '状态',},
      { dataIndex: 'create_by_username', key: 'create_by_username', title: '创建人',},
      { dataIndex: 'updated_by_username', key: 'updated_by_username', title: '更改人',},
      { dataIndex: 'comment', key: 'comment', title: '备注',},
      { dataIndex: 'created_at', key: 'created_at', title: '创建时间', slots: { customRender: 'time' }},
      { dataIndex: 'updated_at', key: 'updated_at', title: '更新时间', slots: { customRender: 'time' }},
      { title: '操作', key: 'action', fixed: 'right', slots: { customRender: 'action', }, align: 'center', width: 120},
    ]
    const { projectList, appId, bizId } = projectRepositories()

    return {
      columns,
      projectList,
      appId,
      bizId,
    }
  }
}
</script>

<style scoped lang="less">

</style>
