<template>
  <div>
    <CommonHeader :info="bizInfo" />
    <div>
      <a-table :columns="columns" :data-source="appList" :rowKey="record => record.ID"
               @change="paginationChange"
               :pagination="pagination" >
        <template #name="{ text }">
          <a>{{ text }}</a>
        </template>
        <template #action="{ record }">
          <div >
            <a-button type="link" @click="addProject(record.ID)">创建项目</a-button>
            <router-link :to="{ name: 'project', params: { bizId: bizInfo.ID, appId: record.ID }}" >项目列表</router-link>
          </div>
        </template>
      </a-table>
    </div>

    <a-modal v-model:visible="visible" :title="modelTitle" @ok="handleSubmit">
      <ProjectEdit ref="editRef" :appId="appId" @visibleChange="visibleChange" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import {AppStore} from "@/utils/store";
import {reactive, ref, toRefs, UnwrapRef} from "vue";
import {TableState} from "ant-design-vue/es/table/interface";
import CommonHeader from "@/components/CommonHeader.vue";
import ProjectEdit from "@/components/ProjectEdit.vue";

export default {
  name: "Biz",
  components: {CommonHeader, ProjectEdit},
  setup() {
    const { appList, bizInfo } = toRefs(AppStore)
    const columns = [
      { dataIndex: 'Name', key: 'Name', title: '名字',},
      { dataIndex: 'DisplayName', key: 'DisplayName', title: '显示名',},
      { dataIndex: 'Level', key: 'Level', title: '级别'},
      { title: '操作', key: 'action', slots: { customRender: 'action', }, align: 'center', width: 200},
    ];
    const pagination = reactive({
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    })
    const editRef = ref()

    const modalState = reactive({
      visible: false,
      modelTitle: '',
      appId: 0,
    })

    const paginationChange = (page: TableState['pagination']) => {
      pagination.current = page?.current as number
      pagination.pageSize = page?.pageSize as number
    }
    const addProject = (appId: number) => {
      modalState.appId = appId
      modalState.visible = true
      modalState.modelTitle = '新增项目'
      editRef.value?.getFormValue({})
    }
    const visibleChange = (value: boolean) => {
      modalState.visible = value
    }
    const handleSubmit = () => {
      editRef.value?.addProjectHandle()
    }

    return {
      bizInfo,
      appList,
      columns,
      pagination,
      paginationChange,
      addProject,
      editRef,
      ...toRefs(modalState),
      handleSubmit,
      visibleChange,
    }
  }
}
</script>

<style scoped lang="less">

</style>
