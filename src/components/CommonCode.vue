<template>
  <div class="overview-panel-content flex-1">
    <div class="overview-measures-row flex">
      <div class="overview-panel-big-padded flex-1 small flex-center big-spacer-left">
        <a class="overview-measures-value text-light">0</a>
        <icon-font type="icon-bug" class="icon-svg little-spacer-right big-spacer-left" />
        <span>New Bugs</span>
      </div>
      <div class="overview-panel-big-padded overview-measures-aside flex-center"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {createFromIconfontCN} from "@ant-design/icons-vue";

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2780490_4v25w6tlomw.js'
})

export default {
  name: "CommonCode",
  components: {IconFont},
  setup() {

    return {

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
.big-spacer-left {
  margin-left: 16px;
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
</style>
