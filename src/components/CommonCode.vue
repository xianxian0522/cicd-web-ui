<template>
  <div class="overview-panel-content flex-1">
    <div class="overview-measures-row flex">
      <div class="overview-panel-big-padded flex-1 small flex-center big-spacer-left">
        <a class="overview-measures-value text-light">0</a>
        <icon-font type="icon-bug" class="icon-svg little-spacer-right big-spacer-left" />
        <span>New Bugs</span>
      </div>
      <div class="overview-panel-big-padded overview-measures-aside flex-center">
        <span class="flex-1 big-spacer-right text-right">Reliability</span>
        <span>
          <a class="link-no-underline"><span class="rating" :style="{backgroundColor: '#0a0'}">A</span></a>
        </span>
      </div>
    </div>

    <div class="overview-measures-row flex">
      <div class="overview-panel-big-padded flex-1 small flex-center big-spacer-left">
        <a class="overview-measures-value text-light">0</a>
        <icon-font type="icon-jiesuo" class="icon-svg little-spacer-right big-spacer-left" />
        <span>New Vulnerabilities</span>
      </div>
      <div class="overview-panel-big-padded overview-measures-aside flex-center">
        <span class="flex-1 big-spacer-right text-right">Security</span>
        <span>
          <a class="link-no-underline"><span class="rating" :style="{backgroundColor: '#0a0'}">A</span></a>
        </span>
      </div>
    </div>

    <div class="overview-measures-row flex">
      <div class="overview-panel-big-padded flex-1 small flex-center big-spacer-left">
        <a class="overview-measures-value text-light">0</a>
        <icon-font type="icon-security" class="icon-svg little-spacer-right big-spacer-left" />
        <span>New Security Hotspots</span>
        <a-tooltip placement="bottom" class="little-spacer-left">
          <template #title>
            <span>Security-sensitive code that requires manual review to assess whether or not a vulnerability exists.</span>
          </template>
          <QuestionCircleOutlined />
        </a-tooltip>
      </div>
      <div class="flex-1 small flex-center">
        <span v-if="false" class="overview-measures-empty-value"></span>
        <span v-else class="flex-center">
          <svg width="24" height="24" class="svg-circle">
            <circle cx="12" cy="12" r="10.5" stroke-width="3" stroke="#a4030f" fill="none"></circle>
            <circle cx="12" cy="12" r="10.5" stroke-width="3" stroke="#00aa00" fill="none" style="stroke-dasharray: 16.485 65.94">
            </circle>
          </svg>
          <span class="huge spacer-left">3.0%</span>
        </span>
        <span class="big-spacer-left">Reviewed</span>
      </div>
      <div class="overview-panel-big-padded overview-measures-aside flex-center">
        <span class="flex-1 big-spacer-right text-right">Security Review</span>
        <span>
          <a class="link-no-underline"><span class="rating" :style="{backgroundColor: '#0a0'}">A</span></a>
        </span>
      </div>
    </div>

    <div class="overview-measures-row flex">
      <div class="overview-panel-big-padded flex-1 small flex-center big-spacer-left">
        <a class="overview-measures-value text-light">0</a>
        <icon-font type="icon-security" class="icon-svg little-spacer-right big-spacer-left" />
        <span>New Vulnerabilities</span>
      </div>
      <div class="overview-panel-big-padded overview-measures-aside flex-center">
        <span class="flex-1 big-spacer-right text-right">Security</span>
        <span>
          <a class="link-no-underline"><span class="rating" :style="{backgroundColor: '#0a0'}">A</span></a>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {createFromIconfontCN} from "@ant-design/icons-vue";
import {ref} from "vue";
import {QuestionCircleOutlined} from '@ant-design/icons-vue'

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2780490_4v25w6tlomw.js'
})

export default {
  name: "CommonCode",
  components: {IconFont, QuestionCircleOutlined},
  props: {
    activeKey: Number,
  },
  setup(props: any) {
    const isNew = ref(props.activeKey === 1)

    return {
      isNew,
    }
  }
}
</script>

<style scoped lang="less">
@import "index";

.overview-panel-content {
  background: #fff;
  border: 1px solid #e6e6e6;
}
.text-light {
  font-weight: 300;
}
.link-no-underline {
  border-bottom: none !important;
}
.overview-panel-big-padded {
  padding: 24px;

  a {
    border-bottom: 1px solid #cae3f2;
    color: #236a97;
    cursor: pointer;
    outline: 0;
    text-decoration: none;
    transition: all .2s ease;
  }
}
.overview-measures-aside {
  flex-basis: 200px;
  box-sizing: border-box;
}
.overview-measures-row {
  min-height: 105px;
  box-sizing: border-box;
}
.overview-measures-row+.overview-measures-row {
  border-top: 1px solid #e6e6e6;
}
.big-spacer-left {
  margin-left: 16px;
}
.overview-measures-empty-value {
  height: 1px;
  width: 16px;
  background: #333;
}
.overview-measures-value {
  line-height: 1;
  font-size: 36px;
  white-space: nowrap;
}
.icon-svg {
  font-size: 16px
}
.little-spacer-right {
  margin-right: 4px;
}
.text-right {
  text-align: right;
}
.rating {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 24px;
  box-sizing: border-box;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  text-shadow: 0 0 1px rgb(0 0 0 / 35%);
}
.spacer-left {
  margin-left: 8px;
}
.svg-circle {
  stroke-dashoffset: 0;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: all .2s;
  z-index: 2;
}
</style>
