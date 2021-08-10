<template>
  <div>
    <a-collapse v-model:activeKey="activeKey" :bordered="false" @change="changeActiveKey">
      <template #expandIcon="{ isActive }">
        <caret-right-outlined :rotate="isActive ? 90 : 0" />
      </template>
      <a-collapse-panel key="1" :style="customStyle">
        <template #header>
          总共 {{ openTotal }} 条 open tickets
        </template>
        <div style="margin-bottom: 10px">
          <a-select
            v-model:value="state"
            size="small"
            placeholder="选择state"
            allowClear
            @click.stop
            style="width: 120px; margin-right: 10px"
          >
            <a-select-option value="open">open</a-select-option>
            <a-select-option value="closed">closed</a-select-option>
          </a-select>
          <a-select
            v-model:value="type"
            size="small"
            placeholder="选择type"
            allowClear
            @click.stop
            style="width: 120px; margin-right: 10px"
          >
            <a-select-option value="generic">generic</a-select-option>
            <a-select-option value="merge_conflict">merge_conflict</a-select-option>
          </a-select>
        </div>
        <CommonTable :columns="ticketColumns" :data-source="ticketsList" :scroll-x="'1000px'" :is-page="true" :isPagination="pagination" @paginationChange="paginationChange">
          <template v-slot:default="slotProps">
            <a-button :disabled="slotProps.action.state === 'closed'" type="link" @click="closedTicket(slotProps.action.id)">关闭ticket</a-button>
          </template>
        </CommonTable>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import {CaretRightOutlined} from "@ant-design/icons-vue";
import {onMounted, reactive, ref, toRefs, watch} from "vue";
import {TicketsResponse} from "@/utils/response";
import cicdRepository from "@/api/cicdRepository";
import CommonTable from "@/components/CommonTable.vue";
import {message} from "ant-design-vue";

export interface PageState {
  pageSize: number;
  pageNumber: number;
}

export default {
  name: "CommonTicket",
  components: { CaretRightOutlined, CommonTable },
  props: {
    appId: Number,
    projectId: Number,
    isAppTicket: Boolean,
  },
  setup(props: any) {
    const activeKey = ref([])
    const customStyle = 'background: #f7f7f7;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden'
    const ticketColumns = [
      { dataIndex: 'app_id', key: 'app_id', title: '应用ID', fixed: 'left', width: 100},
      { dataIndex: 'message', key: 'message', title: '信息',},
      { dataIndex: 'state', key: 'state', title: '状态',},
      { dataIndex: 'type', key: 'type', title: '类型',},
      { dataIndex: 'created_at', key: 'created_at', title: '创建时间', slots: { customRender: 'time' }},
      { dataIndex: 'updated_at', key: 'updated_at', title: '更新时间', slots: { customRender: 'time' }},
      { title: '操作', key: 'action', fixed: 'right', slots: { customRender: 'action', }, align: 'center', width: 120},
    ]
    const ticketsList = ref<TicketsResponse[]>([])
    const pagination = reactive({
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
      total: 10,
    })
    const selectState = reactive({
      state: 'open',
      type: undefined,
    })
    const openTotal = ref()

    const changeActiveKey = (key: string[]) => {
      if (key?.length > 0) {
        queryPageTickets()
      }
    }
    const paginationChange = (value: PageState) => {
      pagination.current = value.pageNumber
      pagination.pageSize = value.pageSize
      queryPageTickets()
    }
    const queryPageTickets = async () => {
      const value = {
        pageSize: pagination.pageSize,
        pageNumber: pagination.current - 1,
        ...selectState
      }
      try {
        const data = props.isAppTicket ? await cicdRepository.queryTicketsByAppId(props.appId, value)
          : await cicdRepository.queryTicketsByProId(props.projectId, value)
        ticketsList.value = data.content
        pagination.total = data.totalElements
      } catch (e) {
        console.error(e)
      }
    }
    const queryOpenCount = async () => {
      try {
        const value = {
          state: 'open',
        }
        openTotal.value = props.isAppTicket ? await cicdRepository.queryTicketOpenCountByAppId(props.appId, value)
          : await cicdRepository.queryTicketOpenCountByProId(props.projectId, value)
      } catch (e) {
        console.error(e)
      }
    }
    const closedTicket = async (id: number) => {
      try {
        await cicdRepository.closeTicket(id)
        message.success('ticket关闭成功')
        await queryPageTickets()
        await queryOpenCount()
      } catch (e) {
        console.error(e)
      }
    }
    watch(selectState, value => {
      changeActiveKey(activeKey.value)
    })
    onMounted(() => {
      queryOpenCount()
    })

    return {
      ...toRefs(selectState),
      activeKey,
      customStyle,
      ticketColumns,
      ticketsList,
      pagination,
      openTotal,
      changeActiveKey,
      paginationChange,
      closedTicket,
    }
  }
}
</script>

<style scoped lang="less">

</style>
