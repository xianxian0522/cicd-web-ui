<template>
  <div class="sonar">
    <div class="sonar-content-header">
      <div class="common-sonar">
        <div class="sonar-header">
          <a-button @click="goToBack"><ArrowLeftOutlined /></a-button>
          <div>{{ projectKey }}</div>
        </div>
        <div>
          <ul class="sonar-menu-bar">
            <li v-for="menu in menuBar" :key="menu.id" @click="handleActive(menu.id)">
              <a :class="{active: menu.id === activeKey}">{{ menu.title }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <OverviewComponent v-if="activeKey === 1" />
      <IssuesComponent v-if="activeKey === 2" />
    </div>
  </div>
</template>

<script lang="ts">
import {useRoute, useRouter} from "vue-router";
import {defineAsyncComponent, ref} from "vue";
import {ArrowLeftOutlined} from '@ant-design/icons-vue';

export default {
  name: "SonarQube",
  components: {
    ArrowLeftOutlined,
    OverviewComponent: defineAsyncComponent(() => import('./OverviewComponent.vue')),
    IssuesComponent: defineAsyncComponent(() => import('./IssuesComponent.vue')),
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const projectKey = ref(route.query.projectKey)
    const activeKey = ref<number>(1)
    const menuBar = ref([
      { id: 1, title: 'Overview' },
      { id: 2, title: 'Issues' }
    ])

    const goToBack = () => {
      router.back()
    }
    const handleActive = (index: number) => {
      activeKey.value = index
    }

    return {
      activeKey,
      menuBar,
      projectKey,
      goToBack,
      handleActive,
    }
  }
}
</script>

<style scoped lang="less">
.sonar {
  font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
}
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
.sonar-content-header {
  border-bottom: 1px solid #e6e6e6;
}
.sonar-menu-bar {
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 0;
  padding: 0;
  list-style: none;
  li {
    cursor: pointer;
    a {
      display: block;
      height: 24px;
      line-height: 16px;
      padding-top: 2px;
      border-bottom: 3px solid transparent;
      box-sizing: border-box;
      color: #333;
      transition: none;
    }
  }
}
.sonar-menu-bar>li>a.active, .sonar-menu-bar>li>a:focus, .sonar-menu-bar>li>a:hover {
  border-bottom-color: #4b9fd5;
}
.sonar-menu-bar li+li {
  margin-left: 20px;
}
</style>
