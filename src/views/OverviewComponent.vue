<template>
  <div class="overview">
    <div class="overview-content">
      <div class="with-25 big-spacer-right">
        <div class="overview-panel">
          <h2 class="overview-panel-title flex-center">
            Quality Gate Status
            <a-tooltip placement="bottom" >
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
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {QuestionCircleOutlined} from '@ant-design/icons-vue'

export default {
  name: "OverviewComponent",
  components: { QuestionCircleOutlined },
}
</script>

<style scoped lang="less">
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
.big-spacer-right {
  margin-right: 16px;
}
.flex-1 {
  flex: 1;
}
.overview-panel {
  min-height: 100%;
}
.flex-center {
  display: flex;
  align-items: center;
}
.overview-panel-title {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 8px;

  span {
    margin-left: 4px;
  }
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
.huge {
  font-size: 24px;
}
.small, small {
  font-size: 12px;
}
</style>
