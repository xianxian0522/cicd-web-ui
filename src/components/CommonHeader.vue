<template>
  <div class="common-content">
    <div class="biz-title">
      <p>{{ info.Name }}</p>
      <p>{{ info.DisplayName }}</p>
      <p>{{ info.Comment }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CommonHeader",
  props: {
    info: Object,
  },
});
</script>

<style scoped lang="less">
.common-content {
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  justify-content: space-between;
}
.biz-title {
  min-width: 300px;
  width: fit-content;
  //padding: 10px 20px;
  //box-shadow: #dcdee5 1px 1px 9px 1px inset;
  border: 1px solid #f0f0f0;
  margin-right: 30px;
  text-align: left;
  p {
    margin: 0;
    padding: 10px 20px;
    font-size: 12px;
  }
  p:nth-of-type(1) {
    border-bottom: 1px solid #f0f0f0;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
