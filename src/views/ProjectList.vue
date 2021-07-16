<template>
  <div>
    <CommonBreadcrumb>
      <template v-slot:first>
        <router-link  :to="{ name: 'biz', query: { bizId } }">biz</router-link>
      </template>
      <template v-slot:second>project</template>
    </CommonBreadcrumb>
    <CommonHeader :app-id="appId"/>
    <CommonTable :columns="columns" :data-source="projectList" :scroll-x="'2500px'">
      <template v-slot:default="slotProps">
        <a-button type="link" >{{slotProps.action.id}}
<!--          <router-link :to="{path: 'host-details/instance/' + slotProps.host.ID}">实例</router-link>-->
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

export default {
  name: "ProjectList",
  components: {
    CommonHeader,
    CommonBreadcrumb,
    CommonTable,
  },
  setup() {
    const columns = [
      { dataIndex: 'base_branch', key: 'base_branch', title: '基本分支', fixed: 'left', width: 120},
      { dataIndex: 'branch_name', key: 'branch_name', title: '分支名',},
      { dataIndex: 'version_name', key: 'version_name', title: '版本名',},
      { dataIndex: 'template_id', key: 'template_id', title: 'template_id',},
      { dataIndex: 'state', key: 'state', title: '状态',},
      { dataIndex: 'app_name', key: 'app_name', title: '应用名',},
      { dataIndex: 'app_display_name', key: 'app_display_name', title: '应用展示名',},
      { dataIndex: 'biz_name', key: 'biz_name', title: '业务名',},
      { dataIndex: 'create_by_username', key: 'create_by_username', title: '创建人',},
      { dataIndex: 'updated_by_username', key: 'updated_by_username', title: '更改人',},
      { dataIndex: 'comment', key: 'comment', title: '备注',},
      { dataIndex: 'created_at', key: 'created_at', title: '创建时间', slots: { customRender: 'time' }},
      { dataIndex: 'updated_at', key: 'updated_at', title: '更新时间', slots: { customRender: 'time' }},
      { title: '操作', key: 'action', fixed: 'right', slots: { customRender: 'action', }, align: 'center', width: 200},
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
