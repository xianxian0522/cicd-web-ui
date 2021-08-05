<template>
  <div>
    <CommonBreadcrumb>
      <template v-slot:first>
        <router-link  :to="{ name: 'biz', query: { bizId } }">biz</router-link>
      </template>
      <template v-slot:second>project</template>
    </CommonBreadcrumb>
    <CommonHeader :app-id="appId"/>
    <a-collapse v-model:activeKey="activeKey" :bordered="false" @change="changeActiveKey">
      <template #expandIcon="{ isActive }">
        <caret-right-outlined :rotate="isActive ? 90 : 0" />
      </template>
      <a-collapse-panel key="1" header="tickets total" :style="customStyle">
        <p>{{ appId }}</p>
      </a-collapse-panel>
    </a-collapse>
    <CommonTable :columns="columns" :data-source="projectList" :scroll-x="'2500px'">
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
import {ref} from "vue";
import {CaretRightOutlined} from '@ant-design/icons-vue'
import cicdRepository from "@/api/cicdRepository";

export default {
  name: "ProjectList",
  components: {
    CommonHeader,
    CommonBreadcrumb,
    CommonTable,
    CaretRightOutlined,
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
      { title: '操作', key: 'action', fixed: 'right', slots: { customRender: 'action', }, align: 'center', width: 120},
    ]
    const { projectList, appId, bizId } = projectRepositories()
    const activeKey = ref([])
    const customStyle = 'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden'

    const changeActiveKey = (key: string[]) => {
      if (key?.length === 0) {
        console.log(key)
      } else {
        cicdRepository.queryTicketsByAppId(appId.value, {})
        console.log('=====')
      }
    }

    return {
      columns,
      projectList,
      appId,
      bizId,
      activeKey,
      customStyle,
      changeActiveKey,
    }
  }
}
</script>

<style scoped lang="less">

</style>
