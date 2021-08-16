<template>
  <a-layout >
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
        class="menu-sider"
        mode="inline"
        v-model:selectedKeys="selectedKeysMenu"
        :style="{ height: '100%', borderRight: 0 }"
      >
        <a-menu-item v-for="item in bar" :key="item.path">
            <span>
              <router-link :to="{name: item.route, params: {appId, bizId}}">{{ item.name }}</router-link>
            </span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content class="common-content-layout app-layout-content">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import {useRoute} from "vue-router";
import {ref} from "vue";
import {BarItem} from "@/utils/response";

export default {
  name: "AppLayout",
  setup() {
    const route = useRoute()
    const url = route.path.split('/')
    const appId = ref(parseInt(route.params.appId as string, 10))
    const bizId = ref(parseInt(route.params.bizId as string, 10))
    const selectedKeysMenu = ref([url[3]])
    const bar = ref<BarItem[]>([
      {id: 1, icon: 'icon-project', path: 'project-list', name: '项目列表', route: 'project'},
      {id: 2, icon: 'icon-version', path: 'version-list', name: '版本列表', route: 'version'},
    ])

    return {
      selectedKeysMenu,
      bar,
      appId,
      bizId,
    }
  }
}
</script>

<style scoped lang="less">
@import "index";
.app-layout-content {
  padding: 0 20px;
}
</style>
