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
import {reactive, ref, toRefs, UnwrapRef} from "vue";
import {TableState} from "ant-design-vue/es/table/interface";
import CommonHeader from "@/components/CommonHeader.vue";
import {RuleObject, ValidateErrorEntity} from "ant-design-vue/es/form/interface";
import cicdRepository from "@/api/cicdRepository";
import {ProjectResponse} from "@/utils/response";

export interface ModalForm {
  BaseBranch: string | undefined;
  BranchName: string | undefined;
  Comment: string | undefined;
  Jira: string | undefined;
  VersionName: string | undefined;
}

export default {
  name: "Biz",
  components: {CommonHeader},
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

    const modalForm: UnwrapRef<ModalForm> = reactive({
      BaseBranch: undefined,
      BranchName: undefined,
      Comment: undefined,
      Jira: undefined,
      VersionName: undefined,
    })
    const modalState = reactive({
      visible: false,
      modelTitle: '',
      appId: 0,
    })
    const formRef = ref()
    const validateVersion = (rule: RuleObject, value: string) => {
      const reg = /^[0-9a-zA-Z_.]{1,}$/
      if (!value) {
        return Promise.reject('Please input VersionName')
      }
      if (!reg.test(value)) {
        return Promise.reject('数组字母下划线点组成')
      }
      return Promise.resolve()
    }
    const validateJira = (rule: RuleObject, value: string) => {
      const reg = /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/?:]?.*$/
      if (reg.test(value) || !value) {
        return Promise.resolve()
      }
      return Promise.reject('输入正确的url')
    }
    const rules = {
      VersionName: [
        { required: true, validator: validateVersion, trigger: 'blur' },
      ],
      Jira: [{ validator: validateJira, trigger: 'change' }],
    };

    const paginationChange = (page: TableState['pagination']) => {
      pagination.current = page?.current as number
      pagination.pageSize = page?.pageSize as number
    }
    const getFormValue = (project: ProjectResponse) => {
      modalForm.BranchName = project.branch_name
      modalForm.BaseBranch = project.base_branch
      modalForm.Comment = project.comment
      modalForm.Jira = project.Jira
      modalForm.VersionName = project.version_name
    }
    const addProject = (appId: number) => {
      modalState.appId = appId
      modalState.visible = true
      modalState.modelTitle = '新增项目'
      getFormValue({})
    }
    const handleSubmit = () => {
      formRef.value.validate()
        .then(() => {
          const value = {...modalForm}
          cicdRepository.addProjectByAppId(modalState.appId, value)
        })
        .catch((error: ValidateErrorEntity) => console.error(error))
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
