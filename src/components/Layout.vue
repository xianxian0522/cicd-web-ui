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
      </div>
      <section class="header-right">
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
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <div class="select-menu-contain">
          <a-select
            v-model:value="bizId"
            show-search
            placeholder="Select a biz"
            :filter-option="filterOptionBiz"
            style="width: 100%"
          >
            <a-select-option v-for="option in bizList" :key="option.ID" :value="option.ID" :title="option.Name">{{ option.Name }}</a-select-option>
          </a-select>
        </div>
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
import {onMounted, reactive, ref, toRefs, watch} from 'vue'
import {useRoute, useRouter} from "vue-router";
import {BarItem, JwtTokenResponse} from "@/utils/response";
import cicdRepository from "@/api/cicdRepository";
import bizRepositories from "@/composable/bizRepositories";
import jwtDecode from "jwt-decode";

export default {
  name: "Layout",
  components: {UserOutlined, DownOutlined},
  setup() {
    const route = useRoute()
    const router = useRouter()
    const url = route.path.split('/')
    const { bizList, bizId } = bizRepositories()

    const state = reactive({
      selectedKey: ['/cicd/biz'],
      selectedKeysMenu: [url[2]],
      username: '用户名',
    })
    const bar = ref<BarItem[]>([
      {id: 1, icon: 'icon-home', path: 'biz', name: '总览'},
    ])
    const menuBar = ref<BarItem[]>([])

    const logout = () => {
      localStorage.removeItem('token')
      router.push('/login')
    }
    const filterOptionBiz = (input: string, option: any) => {
      return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    const getBar = async () => {
      try {
        menuBar.value = await cicdRepository.queryBar()
      } catch (e) {
        console.error(e)
      }
    }

    watch(() => route.path, value => {
      const url = value.split('/')
      state.selectedKeysMenu = [url[2]]
    })

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
      bar,
      menuBar,
      bizList,
      bizId,
      logout,
      filterOptionBiz,
    }
  }
}
</script>

<style scoped lang="less">
@baseBorder: #DCDEE5;
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
.common-content {
  background: #fff;
  border-left: 1px solid #DCDEE5;
  padding: 20px;
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
.select-menu-contain {
  display: flex;
  justify-content: center;
  height: 53px;
  align-items: center;
  border-bottom: 1px solid @baseBorder;
  padding: 0 10px;
}
</style>
