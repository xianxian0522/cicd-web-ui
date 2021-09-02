<template>
  <div class="common-header">
    <div class="biz-title" v-if="appId">
      <p>{{ appInfo?.Name }}</p>
      <p>{{ appInfo?.DisplayName }}</p>
      <p>{{ appInfo?.Comment }}</p>
    </div>
    <div class="biz-title" v-else>
      <p>{{ info.Name }}</p>
      <p>{{ info.DisplayName }}</p>
      <p>{{ info.Comment }}</p>
    </div>
    <div v-if="isEdit">
      <a-button type="primary" @click="addProjectHandle">添加项目</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import appInfoRepositories from "@/composable/appInfoRepositories";

export default defineComponent({
  name: "CommonHeader",
  props: {
    info: Object,
    appId: Number,
    isEdit: Boolean,
  },
  emits: ['addProject'],
  setup(props: any, {emit}: any) {
    const { appInfo } = appInfoRepositories()

    const addProjectHandle = () => {
      try {
        emit('addProject')
      } catch (e) {
        console.error(e)
      }
    }

    return {
      appInfo,
      addProjectHandle,
    }
  }
});
</script>

<style scoped lang="less">
.common-header {
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  justify-content: space-between;
}
.biz-title {
  min-width: 300px;
  width: fit-content;
  //padding: 10px 20px;
  //box-shadow: #dcdee5 1px 1px 9px 1px inset;
  border: 1px solid #f0f0f0;
  margin-right: 30px;
  text-align: left;
  p {
    margin: 0;
    padding: 10px 20px;
    font-size: 12px;
  }
  p:nth-of-type(1) {
    border-bottom: 1px solid #f0f0f0;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
