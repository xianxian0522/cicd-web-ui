<template>
  <div class="overview">
    <div class="overview-content">
      <div class="with-25 big-spacer-right">
        <div class="overview-panel">
          <h2 class="overview-panel-title flex-center">
            Quality Gate Status
            <a-tooltip placement="bottom" class="little-spacer-left">
              <template #title>
                <span>A Quality Gate is a set of measure-based Boolean conditions. It helps you know immediately whether your project is production-ready. If your current status is not Passed, you'll see which measures caused the problem and the values required to pass.</span>
              </template>
              <QuestionCircleOutlined />
            </a-tooltip>
          </h2>
          <div class="overview-panel-content">
            <div class="overview-quality-gate-badge-large success">
              <h3 class="big-spacer-bottom huge">Passed</h3>
              <span class="small">All conditions passed.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div class="overview-panel">
          <h2 class="overview-panel-title">Measures</h2>
          <div class="flex">
            <div class="overview-btn" v-for="btn in buttonMenu" :key="btn.id" @click="handleActiveChange(btn.id)" :class="{'btn-active': btn.id === activeKey}">
              <div :class="{'btn-select': btn.id === activeKey}"></div>
              <div class="text-left overview-measures-tab">
                <div class="text-bold">{{ btn.title }}</div>
                <div v-if="btn.id === 1" class="note spacer-top">Since August 16, 2021</div>
                <div v-if="btn.id === 1" class="note little-spacer-top">Started 15 days ago</div>
              </div>
            </div>
          </div>
          <CommonCode :activeKey="activeKey" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {QuestionCircleOutlined} from '@ant-design/icons-vue'
import {ref} from "vue";
import CommonCode from "@/components/CommonCode.vue";

export default {
  name: "OverviewComponent",
  components: { QuestionCircleOutlined, CommonCode },
  setup() {
    const activeKey = ref<number>(1)
    const buttonMenu = ref([
      {id: 1, title: 'New Code'},
      {id: 2, title: 'Overall Code'},
    ])

    const handleActiveChange = (index: number) => {
      activeKey.value = index
    }

    return {
      activeKey,
      buttonMenu,
      handleActiveChange,
    }
  }
}
</script>

<style scoped lang="less">
@import "../components/index";

.overview {
  padding: 20px;
}
.overview-content {
  animation: fadeIn .5s forwards;
  display: flex;
  flex-direction: row;
}
.with-25 {
  width: 25%;
}
.overview-panel {
  min-height: 100%;
}
.overview-panel-title {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 8px;
}
.overview-panel-content {
  background: #fff;
  border: 1px solid #e6e6e6;
}
.overview-quality-gate-badge-large.success {
  background: #0a0;
  height: 160px;
}
.overview-quality-gate-badge-large {
  padding: 16px;
  color: #fff;
  box-sizing: border-box;
  h3 {
    color: #fff;
  }
}
.big-spacer-bottom {
  margin-bottom: 16px;
}
.btn-active {
  background-color: #fff;
}
.overview-btn {
  position: relative;
  border-top: 1px solid #e6e6e6;
  border-left: 1px solid #e6e6e6;
  border-right: none;
  border-bottom: none;
  margin-bottom: -1px;
  min-width: 128px;
  min-height: 56px;
  height: auto;
  outline: 0;
  padding: calc(16px);
}
.overview-btn:last-child {
  border-right: 1px solid rgb(230, 230, 230);
}
.overview-btn:not(.btn-active) {
  cursor: pointer;
}
.overview-btn:not(.btn-active):hover {
  background-color: #f8f8f8;
}
.btn-select {
  display: block;
  background-color: rgb(75, 159, 213);
  height: 3px;
  width: 100%;
  position: absolute;
  left: 0;
  top: -1px;
}
.overview-measures-tab {
  width: 128px;
}
.text-left {
  text-align: left;
}
.text-bold {
  font-weight: 700;
}
.note {
  color: #666;
  font-size: 12px;
}
.little-spacer-top {
  margin-top: 4px;
}

</style>
