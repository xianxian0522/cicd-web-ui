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
          <div style="display: flex; justify-content: space-around">
            <a-button type="link" @click="addProject(record.ID)">创建项目</a-button>
<!--            <router-link :to="{ path: 'biz/deploy-list', query: { appId: record.ID }}" >发布列表</router-link>-->
          </div>
        </template>
      </a-table>
    </div>

    <a-modal v-model:visible="visible" :title="modelTitle" @ok="handleSubmit">
      <a-form ref="formRef" :rules="rules" :model="modalForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="基本分支" >
          <a-input v-model:value="modalForm.BaseBranch" placeholder="基本分支" />
        </a-form-item>
        <a-form-item label="分支名">
          <a-input v-model:value="modalForm.BranchName" placeholder="分支名" />
        </a-form-item>
        <a-form-item label="Jira" name="Jira">
          <a-input v-model:value="modalForm.Jira" placeholder="Jira" />
        </a-form-item>
        <a-form-item label="版本名" name="VersionName">
          <a-input v-model:value="modalForm.VersionName" placeholder="版本名" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model:value="modalForm.Comment" placeholder="备注" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {AppStore} from "@/utils/store";
import {reactive, ref, toRefs} from "vue";
import {TableState} from "ant-design-vue/es/table/interface";
import CommonHeader from "@/components/CommonHeader.vue";
import {RuleObject} from "ant-design-vue/es/form/interface";

export default {
  name: "Biz",
  components: {CommonHeader},
  setup() {
    const { appList, bizInfo } = toRefs(AppStore)
    const columns = [
      { dataIndex: 'Name', key: 'Name', title: '名字',},
      { dataIndex: 'DisplayName', key: 'DisplayName', title: '显示名',},
      { dataIndex: 'Level', key: 'Level', title: '级别'},
      { title: '操作', key: 'action', slots: { customRender: 'action', }, align: 'center', width: 100},
    ];
    const pagination = reactive({
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    })

    const modalForm = reactive({
      BaseBranch: '',
      BranchName: '',
      Comment: '',
      Jira: '',
      VersionName: '',
    })
    const modalState = reactive({
      visible: false,
      modelTitle: '',
      appId: 0,
    })
    const formRef = ref()
    const validateVersion = (rule: RuleObject, value: string) => {
      const reg = /^[0-9a-zA-Z_.]{1,}$/
      if (!reg.test(value)) {
        return Promise.reject('数组字母下划线点组成')
      }
      return Promise.resolve()
    }
    const validateJira = (rule: RuleObject, value: string) => {
      const reg = /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/?:]?.*$/
      if (!reg.test(value)) {
        return Promise.reject('输入正确的url')
      }
      return Promise.resolve()
    }
    const rules = {
      VersionName: [
        { required: true, message: 'Please input Activity VersionName', trigger: 'blur' },
        { validator: validateVersion, trigger: 'change' },
      ],
      Jira: [{ validator: validateJira, trigger: 'change' }],
    };

    const paginationChange = (page: TableState['pagination']) => {
      pagination.current = page?.current as number
      pagination.pageSize = page?.pageSize as number
    }
    const addProject = (appId: number) => {
      modalState.appId = appId
      modalState.visible = true
      modalState.modelTitle = '新增项目'
    }
    const handleSubmit = () => {
      console.log(modalForm)
    }

    return {
      bizInfo,
      appList,
      columns,
      pagination,
      paginationChange,
      addProject,
      modalForm,
      formRef,
      rules,
      ...toRefs(modalState),
      handleSubmit,
    }
  }
}
</script>

<style scoped lang="less">

</style>
