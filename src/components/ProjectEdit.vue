<template>
  <div>
    <a-form ref="formRef" :rules="rules" :model="modalForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="分支类型" name="VersionType">
        <a-select
          v-model:value="modalForm.VersionType"
          placeholder="please select versionType"
          style="width: 100%"
        >
          <a-select-option value="hotfix">hotfix</a-select-option>
          <a-select-option value="feature">feature</a-select-option>
          <a-select-option value="release">release</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="版本名" name="VersionName">
        <a-input v-model:value="modalForm.VersionName" :prefix="modalForm.VersionType ? modalForm.VersionType + '_' : modalForm.VersionType" placeholder="版本名" />
      </a-form-item>
      <a-form-item label="备注">
        <a-input v-model:value="modalForm.Comment" placeholder="备注" />
      </a-form-item>
      <a-form-item label="Jira" name="Jira">
        <a-input v-model:value="modalForm.Jira" placeholder="Jira" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">

import {reactive, ref, UnwrapRef} from "vue";
import {ProjectResponse} from "@/utils/response";
import {RuleObject, ValidateErrorEntity} from "ant-design-vue/es/form/interface";
import cicdRepository from "@/api/cicdRepository";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";

export interface ModalForm {
  Comment: string | undefined;
  Jira: string | undefined;
  VersionName: string | undefined;
  VersionType: string | undefined;
}

export default {
  name: "ProjectEdit",
  props: {
    appId: Number
  },
  emits: ['visibleChange'],
  setup(props: any, {emit}: any) {
    const router = useRouter()
    const formRef = ref()
    const modalForm: UnwrapRef<ModalForm> = reactive({
      Comment: undefined,
      Jira: undefined,
      VersionName: undefined,
      VersionType: undefined,
    })
    const validateVersion = (rule: RuleObject, value: string) => {
      const reg = /^[0-9a-zA-Z_.]+$/
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
      VersionType: [{required: true, message: 'Please input version type', trigger: 'blur'}],
      Jira: [{ validator: validateJira, trigger: 'change' }],
    };

    const getFormValue = (project: ProjectResponse) => {
      modalForm.Comment = project?.comment
      modalForm.Jira = project?.Jira
      modalForm.VersionName = project?.version_name
      modalForm.VersionType = project?.version_type
    }

    const addProjectHandle = () => {
      formRef.value.validate()
        .then(async () => {
          const value = {...modalForm}
          value.VersionName = value.VersionType + '_' + value.VersionName
          const data = await cicdRepository.addProjectByAppId(props.appId, value)
          emit('visibleChange', false)
          message.success('新增项目成功')
          const params: any = {appId: props.appId, bizId: data.biz_id}
          await router.push({
            name: 'project-detail',
            query: {projectId: data.id},
            params,
          })
        })
        .catch((error: ValidateErrorEntity) => console.error(error))
    }

    return {
      formRef,
      rules,
      modalForm,
      getFormValue,
      addProjectHandle,
    }
  }
}
</script>

<style scoped lang="less">

</style>
