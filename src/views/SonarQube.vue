<template>
  <div>
    <div class="common-sonar">
      <div class="sonar-header">
        <a-button @click="goToBack"><ArrowLeftOutlined /></a-button>
        <div>{{ projectKey }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import {ArrowLeftOutlined} from '@ant-design/icons-vue'

export default {
  name: "SonarQube",
  components: { ArrowLeftOutlined },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const projectKey = ref(route.query.projectKey)

    const goToBack = () => {
      router.back()
    }

    return {
      projectKey,
      goToBack,
    }
  }
}
</script>

<style scoped lang="less">
.sonar-header {
  display: flex;
  padding: 8px 0;
  align-items: center;
  button {
    margin-right: 10px;
  }
}
.common-sonar {
  background: #fff;
  padding: 0 20px;
}
</style>
