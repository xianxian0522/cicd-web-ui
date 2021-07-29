<template>
  <a-layout class="layout">
<!--    <a-layout-header class="header">-->
<!--      <div class="logo" >-->
<!--        <img src="http://www.sumscope.com/favicon.ico" alt="">-->
<!--        CICD-->
<!--      </div>-->
<!--      <div class="layout-header-menu">-->
<!--        <a-menu-->
<!--          theme="dark"-->
<!--          mode="horizontal"-->
<!--          v-model:selectedKeys="selectedKey"-->
<!--          :style="{ lineHeight: '58px' }"-->
<!--        >-->
<!--          <a-menu-item v-for="bar in menuBar" :key="bar.route">-->
<!--            <a :href="bar.path">{{ bar.name }}</a>-->
<!--          </a-menu-item>-->
<!--        </a-menu>-->
<!--      </div>-->
<!--      <section class="header-right">-->
<!--        <a-avatar class="user-avatar">-->
<!--          <template #icon><UserOutlined /></template>-->
<!--        </a-avatar>-->
<!--        <a-dropdown>-->
<!--          <a class="ant-dropdown-link" @click.prevent>-->
<!--            {{ username }}-->
<!--            <DownOutlined />-->
<!--          </a>-->
<!--          <template #overlay>-->
<!--            <a-menu>-->
<!--              <a-menu-item>-->
<!--                <a @click="logout()">退出</a>-->
<!--              </a-menu-item>-->
<!--            </a-menu>-->
<!--          </template>-->
<!--        </a-dropdown>-->
<!--      </section>-->
<!--    </a-layout-header>-->
    <HeaderComponent :logoTitle="'CICD'"/>

    <router-view ></router-view>
  </a-layout>
</template>

<script lang="ts">
import {DownOutlined, UserOutlined} from "@ant-design/icons-vue";
import {onMounted, reactive, ref, toRefs, watch} from 'vue'
import { useRouter} from "vue-router";
import {BarItem, JwtTokenResponse} from "@/utils/response";
import cicdRepository from "@/api/cicdRepository";
import jwtDecode from "jwt-decode";

export default {
  name: "Layout",
  // components: {UserOutlined, DownOutlined},
  setup() {
    const router = useRouter()
    const state = reactive({
      selectedKey: ['/cicd/biz'],
      username: '用户名',
    })
    const menuBar = ref<BarItem[]>([])

    const logout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }

    const getBar = async () => {
      try {
        menuBar.value = await cicdRepository.queryBar()
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(() => {
      getBar()

      const token = localStorage.getItem('token')
      if (token) {
        const userInfo = jwtDecode<JwtTokenResponse>(token)
        state.username = userInfo?.username || userInfo?.name
      }
    })

    return {
      ...toRefs(state),
      menuBar,
      logout,
    }
  }
}
</script>

<style scoped lang="less">
@baseBorder: #DCDEE5;
.layout {
  width: 100vw;
  height: inherit;
  overflow: hidden;
  background: #fff;
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
  overflow: auto;
  ul {
    white-space: nowrap;
  }
}
.user-avatar {
  margin-right: 4px;
}
.header-right {
  white-space: nowrap;
  float: right;
  margin-left: 10px;
  line-height: 58px;
}
.layout-header-menu /deep/ .ant-menu-dark .ant-menu-item:hover {
  background-color: #1890ff;
}
.layout /deep/ .ant-layout-header {
  height: 58px;
  display: flex;
  padding: 0 40px;
}
</style>
