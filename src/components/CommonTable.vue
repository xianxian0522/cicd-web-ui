<template>
  <div>
    <a-table :columns="columns" :data-source="dataSource" :rowKey="record => record.id"
             @change="paginationChange"
             :scroll="{x: scrollX}"
             :pagination="pagination" >
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #time="{ text }">
        <span>{{ timeFormat(text) }}</span>
      </template>
      <template #action="{ record }" >
        <div >
          <slot :action="record"></slot>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import {reactive} from "vue";
import {TableState} from "ant-design-vue/es/table/interface";
import moment from "moment";

export default {
  name: "CommonTable",
  props: {
    columns: Array,
    dataSource: Array,
    scrollX: {
      type: String,
      default: 'auto'
    },
  },
  setup() {
    const pagination = reactive({
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    })
    const paginationChange = (page: TableState['pagination']) => {
      pagination.current = page?.current as number
      pagination.pageSize = page?.pageSize as number
    }
    const timeFormat = (value: string) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }

    return {
      pagination,
      paginationChange,
      timeFormat,
    }
  }
}
</script>

<style scoped lang="less">

</style>
