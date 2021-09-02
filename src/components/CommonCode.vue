<template>
  <div class="overview-panel-content flex-1">
    <div class="overview-measures-row flex">
      <div class="overview-panel-big-padded flex-1 small flex-center big-spacer-left">
        <a class="overview-measures-value text-light link-underline">0</a>
        <icon-font type="icon-bug" class="icon-svg little-spacer-right big-spacer-left" />
        <span><span v-if="activeKey === 1">New</span> Bugs</span>
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
        <a class="overview-measures-value text-light link-underline">0</a>
        <icon-font type="icon-jiesuo" class="icon-svg little-spacer-right big-spacer-left" />
        <span><span v-if="activeKey === 1">New</span> Vulnerabilities</span>
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
        <a class="overview-measures-value text-light link-underline">0</a>
        <icon-font type="icon-security" class="icon-svg little-spacer-right big-spacer-left" />
        <span><span v-if="activeKey === 1">New</span> Security Hotspots</span>
        <a-tooltip placement="bottom" class="little-spacer-left" :overlay-style="{fontSize: '12px'}" color="#475760">
          <template #title>
            <span class="tooltip-title-color">Security-sensitive code that requires manual review to assess whether or not a vulnerability exists.</span>
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
        <a class="overview-measures-value text-light link-underline">33min</a>
        <span class="big-spacer-left"><span v-if="activeKey === 1">Added</span> Debt</span>
      </div>
      <div class="flex-1 small flex-center">
        <a class="overview-measures-value text-light link-underline">0</a>
        <icon-font type="icon-security" class="icon-svg little-spacer-right big-spacer-left" />
        <span><span v-if="activeKey === 1">New</span> Code Smells</span>
      </div>
      <div class="overview-panel-big-padded overview-measures-aside flex-center">
        <span class="flex-1 big-spacer-right text-right">Maintainability</span>
        <span>
          <a class="link-no-underline"><span class="rating" :style="{backgroundColor: '#0a0'}">A</span></a>
        </span>
      </div>
    </div>

    <div class="overview-measures-row flex">
      <div class="overview-panel-huge-padded flex-1 bordered-right">
        <div v-if="activeKey === 1" class="flex-column flex-1">
          <div class="flex-center flex-justify-center">
            <span class="big-spacer-right flex-center">
              <svg width="40" height="40" class="svg-circle">
                <circle cx="20" cy="20" r="18.5" stroke-width="3" stroke="#a4030f" fill="none"></circle>
                <circle cx="20" cy="20" r="18.5" stroke-width="3" stroke="#00aa00" fill="none" style="stroke-dasharray: 16.485 116.18">
                </circle>
              </svg>
            </span>
            <a class="overview-measures-value text-light link-underline">0.0%</a>
          </div>
          <div class="spacer-top flex-justify-center">
            <span>
              Coverage on
              <a class="link-underline big">169</a>
              New Lines to cover
            </span>
          </div>
        </div>
        <div v-else class="flex-center">
          <div class="flex-center">
            <span class="big-spacer-right">
              <svg width="40" height="40" class="svg-circle">
                <circle cx="20" cy="20" r="18.5" stroke-width="3" stroke="#a4030f" fill="none"></circle>
                <circle cx="20" cy="20" r="18.5" stroke-width="3" stroke="#00aa00" fill="none" style="stroke-dasharray: 16.485 116.18">
                </circle>
              </svg>
            </span>
            <div class="flex-column">
              <span><a class="overview-measures-value text-light link-underline">3.0%</a></span>
              <span class="spacer-top"></span>
              <span>
                Coverage on
                <a class="link-underline big">764</a>
                Lines to cover
              </span>
            </div>
          </div>
          <div class="huge-spacer-left">
            <div class="flex-column">
              <span class="overview-measures-value text-light"> - </span>
              <span class="spacer-top">Unit Tests</span>
            </div>
          </div>
        </div>
      </div>
      <div class="overview-panel-huge-padded flex-1">
        <div v-if="activeKey === 1" class="flex-column flex-1">
          <div class="flex-center flex-justify-center">
            <div class="big-spacer-right">
              <div class="duplications-rating-big" style="border-color: #0a0;">
                <div style="background: #ed7d20" class="duplications-rating"></div>
              </div>
            </div>
            <a class="overview-measures-value text-light link-underline">0.0%</a>
          </div>
          <div class="spacer-top flex-justify-center">
            <span>
              Duplications on
              <a class="link-underline big">955</a>
               New Lines
            </span>
          </div>
        </div>
        <div v-else class="flex-center">
          <div class="flex-center">
            <div class="big-spacer-right">
              <div class="duplications-rating-big" style="border-color: #ed7d20;">
                <div style="background: #ed7d20" class="duplications-rating"></div>
              </div>
            </div>
            <div class="flex-column">
              <span><a class="overview-measures-value text-light link-underline">10.0%</a></span>
              <span class="spacer-top"></span>
              <span>
                Duplications on
                <a class="link-underline big">2.4k</a>
                 Lines
              </span>
            </div>
          </div>
          <div class="huge-spacer-left">
            <div class="flex-column">
              <span><a class="overview-measures-value text-light link-underline">30</a></span>
              <span class="spacer-top">Duplicated Blocks</span>
            </div>
          </div>
        </div>
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
}
.link-underline {
  border-bottom: 1px solid #cae3f2;
  color: #236a97;
  cursor: pointer;
  outline: 0;
  text-decoration: none;
  transition: all .2s ease;
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
.overview-panel-huge-padded {
  padding: 40px;
}
.bordered-right {
  border-right: 1px solid #e6e6e6;
}
.huge-spacer-left {
  margin-left: 40px;
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
.duplications-rating {
  background-color: #ed7d20;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
.duplications-rating-big {
  width: 40px;
  height: 40px;
  border: 3px solid #ed7d20;
  border-radius: 50%;
  display: inline-flex;
  vertical-align: top;
  justify-content: center;
  align-items: center;
}
.svg-circle {
  stroke-dashoffset: 0;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: all .2s;
  z-index: 2;
}
</style>
