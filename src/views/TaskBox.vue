<template>
  <div class="step-box">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="1" :header="stepInfo?.state + ' - ' + title">
        <p>{{ title }}</p>
        <template #extra>
          <a-button size="small"><ProfileOutlined @click="handleEditClick" /></a-button>
        </template>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import {ProfileOutlined} from '@ant-design/icons-vue'
import {ref} from "vue";

export default {
  name: "TaskBox",
  props: {
    title: String,
    stepInfo: Object,
  },
  components: {ProfileOutlined},
  setup() {
    const activeKey = ref(['0'])

    const handleEditClick = () => {
      console.log('edit')
    }

    return {
      activeKey,
      handleEditClick,
    }
  }
}
</script>

<style scoped lang="less">
.step-box {
  margin-top: 15px;
}
</style>
