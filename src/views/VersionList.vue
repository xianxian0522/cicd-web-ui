<template>
  <div class="common-content-list">
    <CommonBreadcrumb>
      <template v-slot:first>
        <router-link  :to="{ name: 'biz', query: { bizId } }">biz</router-link>
      </template>
      <template v-slot:second>version</template>
    </CommonBreadcrumb>
    <CommonHeader :app-id="appId"/>
    <CommonTable :columns="columns" :data-source="versionList" >
      <template v-slot:default="slotProps">
        <a-button type="link" >{{slotProps.action.id}}</a-button>
      </template>
    </CommonTable>
  </div>
</template>

<script lang="ts">
import CommonBreadcrumb from "@/components/CommonBreadcrumb.vue";
import CommonHeader from "@/components/CommonHeader.vue";
import CommonTable from "@/components/CommonTable.vue";
import versionRepositories from "@/composable/versionRepositories";

export default {
  name: "VersionList",
  components: {
    CommonBreadcrumb, CommonHeader,
    CommonTable,
  },
  setup() {
    const columns = [
      { dataIndex: 'name', key: 'name', title: '版本名', fixed: 'left', width: 180},
      { dataIndex: 'app_name', key: 'app_name', title: '应用名',},
      { dataIndex: 'biz_name', key: 'biz_name', title: '业务名',},
      { dataIndex: 'commit_id', key: 'commit_id', title: 'commit_id',},
      { dataIndex: 'created_at', key: 'created_at', title: '创建时间', slots: { customRender: 'time' }},
      { dataIndex: 'updated_at', key: 'updated_at', title: '更新时间', slots: { customRender: 'time' }},
      { title: '操作', key: 'action', fixed: 'right', slots: { customRender: 'action', }, align: 'center', width: 200},
    ]
    const { appId, bizId, versionList } = versionRepositories()

    return {
      columns,
      appId,
      bizId,
      versionList,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index";
</style>
