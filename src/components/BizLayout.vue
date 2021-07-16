<template>
  <a-layout >
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
              <router-link :to="'/cicd/' + item.path">{{ item.name }}</router-link>
            </span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content class="common-content">
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import {ref, watch} from "vue";
import bizRepositories from "@/composable/bizRepositories";
import {BarItem} from "@/utils/response";
import {useRoute} from "vue-router";

export default {
  name: "BizLayout",
  setup() {
    const route = useRoute()
    const url = route.path.split('/')
    const selectedKeysMenu = ref([url[2]])
    const { bizList, bizId } = bizRepositories()
    const bar = ref<BarItem[]>([
      {id: 1, icon: 'icon-home', path: 'biz', name: '总览'},
    ])

    const filterOptionBiz = (input: string, option: any) => {
      return option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }

    watch(() => route.path, value => {
      const url = value.split('/')
      selectedKeysMenu.value = [url[2]]
    })

    return {
      bar,
      selectedKeysMenu,
      bizList,
      bizId,
      filterOptionBiz,
    }
  }
}
</script>

<style scoped lang="less">
@baseBorder: #DCDEE5;
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
.common-content {
  background: #fff;
  border-left: 1px solid #DCDEE5;
  padding: 20px;
  height: inherit;
  // 超过的高度滚动
  overflow: scroll;
}
</style>
