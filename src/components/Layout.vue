<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="logo" >
        <img src="http://www.sumscope.com/favicon.ico" alt="">
        CICD
      </div>
      <div class="layout-header-menu">
        <a-menu
          theme="dark"
          mode="horizontal"
          v-model:selectedKeys="selectedKey"
          :style="{ lineHeight: '58px' }"
        >
          <a-menu-item v-for="bar in menuBar" :key="bar.route">
            <a :href="bar.path">{{ bar.name }}</a>
          </a-menu-item>
        </a-menu>
        <section>
          <a-avatar class="user-avatar">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              {{ username }}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="logout()">退出</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </section>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          class="menu-sider"
          mode="inline"
          v-model:selectedKeys="selectedKeysMenu"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-menu-item v-for="item in bar" :key="item.path">
            <span>
<!--              <icon-font :type="item.icon" />-->
              <router-link :to="'/toolbox/' + item.path">{{ item.name }}</router-link>
            </span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout-content class="common-content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {DownOutlined, UserOutlined} from "@ant-design/icons-vue";
import {reactive, ref, toRefs} from 'vue'
import {useRoute} from "vue-router";
import {BarItem} from "@/utils/response";

export default {
  name: "Layout",
  components: {UserOutlined, DownOutlined},
  setup() {
    const route = useRoute()
    const url = route.path.split('/')

    const state = reactive({
      selectedKey: ref(['/cicd/home']),
      // selectedKeysMenu: ref([url[url.length - 1]]),
      selectedKeysMenu: ref([url[2]]),
      username: '用户名',
    })
    const bar = ref<BarItem[]>([])
    const menuBar = ref<BarItem[]>([])

    const logout = () => {
      localStorage.removeItem('token')
    }

    return {
      ...toRefs(state),
      bar,
      menuBar,
      logout,
    }
  }
}
</script>

<style scoped lang="less">
.layout {
  width: 100vw;
  height: inherit;
  //height: 100vh;
  //overflow: hidden;
}
// 侧边栏滚动
.ant-layout-sider {
  overflow: auto;
}

.logo {
  min-width: 130px;
  height: 58px;
  float: left;
  color: #fff;
  margin-right: 30px;
  text-align: left;
  font-weight: 500;
  line-height: 58px;
  img {
    width: 45px;
  }
}
.layout-header-menu {
  display: flex;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  ul, section {
    white-space: nowrap;
  }
  .user-avatar {
    margin-right: 4px;
  }
}
.layout-header-menu /deep/ .ant-menu-dark .ant-menu-item:hover {
  background-color: #1890ff;
}
.common-content {
  background: #fff;
  border-left: 1px solid #DCDEE5;
  padding: 0 20px;
  height: inherit;
  // 超过的高度滚动
  overflow: scroll;
}
.layout /deep/ .ant-layout-header {
  height: 58px;
  display: flex;
  padding: 0 40px;
}
.menu-sider {
  li {
    text-align: left;
  }
  a::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
    content: '';
  }
  a {
    color: rgba(0, 0, 0, 0.85);
    margin-left: 10px;
  }
  .ant-menu-item-selected a, a:hover {
    color: #1890ff;
  }
}
</style>
