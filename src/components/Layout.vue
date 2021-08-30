<template>
  <a-layout class="layout">
    <HeaderComponent :logoTitle="'CICD'" :menuSelect="'/cicd/biz'"/>

    <router-view ></router-view>
  </a-layout>
</template>

<script lang="ts">
export default {
  name: "Layout",
  setup() {

    return {
      
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

//.layout ::v-deep .ant-menu-horizontal > .ant-menu-item a::before {
//  bottom: 0;
//}
</style>
