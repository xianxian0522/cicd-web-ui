<template>
  <div>
    <a-table class="common-table" :columns="columns" :data-source="dataSource" :rowKey="record => record.id"
             @change="paginationChange"
             :scroll="{x: scrollX}"
             :rowClassName="(record) => (isAlarm && record?.state === 'open' ? 'ticket-open' : null)"
             :pagination="isPage ? isPagination : pagination">
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
    isPage: Boolean,
    isPagination: Object,
    isAlarm: Boolean,
  },
  emits: ['paginationChange'],
  setup(props: any, {emit}: any) {
    const pagination = reactive({
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    })
    const paginationChange = (page: TableState['pagination']) => {
      const pageNumber = page?.current as number
      const pageSize = page?.pageSize as number
      if (props.isPage) {
        console.log(pageNumber, pageSize)
        emit('paginationChange', {pageNumber, pageSize})
      } else {
        pagination.current = pageNumber
        pagination.pageSize = pageSize
      }
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
.common-table ::v-deep .ticket-open {
  background-color: #fff1f0;
}
</style>
