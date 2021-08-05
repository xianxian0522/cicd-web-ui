<template>
  <div>
    <a-collapse v-model:activeKey="activeKey" :bordered="false" @change="changeActiveKey">
      <template #expandIcon="{ isActive }">
        <caret-right-outlined :rotate="isActive ? 90 : 0" />
      </template>
      <a-collapse-panel key="1" header="tickets total" :style="customStyle">
        <CommonTable :columns="ticketColumns" :data-source="ticketsList" :scroll-x="'1000px'" :is-page="true" :isPagination="pagination" @paginationChange="paginationChange">
          <template v-slot:default="slotProps">
            <a-button type="link" > {{ slotProps.action.id }} 关闭ticket</a-button>
          </template>
        </CommonTable>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import {CaretRightOutlined} from "@ant-design/icons-vue";
import {reactive, ref} from "vue";
import {TicketsResponse} from "@/utils/response";
import cicdRepository from "@/api/cicdRepository";
import CommonTable from "@/components/CommonTable.vue";

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
      pageSize: 1,
      total: 1,
    })

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

    return {
      activeKey,
      customStyle,
      ticketColumns,
      ticketsList,
      pagination,
      changeActiveKey,
      paginationChange,
    }
  }
}
</script>

<style scoped lang="less">

</style>
