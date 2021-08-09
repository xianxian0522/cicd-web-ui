<template>
  <div class="step-box">
    <a-collapse v-model:activeKey="activeKey">
      <a-collapse-panel key="1" :header="stepInfo?.state + ' - ' + title"
                        :show-arrow="stepInfo?.state !== 'TODO'"
                        :disabled="stepInfo?.state === 'TODO'"
                        :style="{background: taskStates[stepInfo?.state],
                        'border':'1px solid ' + taskStates[stepInfo?.state],
                        color: stepInfo?.state === 'TODO' ? '#000' : stepInfo?.state === 'PRUNE' ? 'grey' : '#fff'}">
        <div v-if="stepInfo?.output">
          Output:
          <TaskEditor :editor-id="'output' + title" :editor-value="stepInfo?.output" />
        </div>
        <div v-if="stepInfo?.error">
          Error:
          <TaskEditor :editor-id="'error' + title" :editor-value="stepInfo?.error" />
        </div>
        <div v-if="stepInfo?.last_run">Last run: <strong>{{ timeFormat(stepInfo?.last_run) }}</strong></div>
        <template #extra>
          <a-button v-if="(advancedDisplay && stepInfo?.state !== 'TODO') || (!advancedDisplay && stepInfo?.redo_step)" size="small" style="margin-right: 4px;"><PlayCircleOutlined @click.stop="workflowRedo" style="color: #fff;" /></a-button>
          <a-button size="small"><ProfileOutlined @click.stop="showTaskEdit" style="color: #fff;" /></a-button>
        </template>
      </a-collapse-panel>
    </a-collapse>

    <a-modal v-model:visible="modalVisible" :title="modalTitle" width="80vw" >
      <template #footer>
        <a-button @click="cancelTaskEdit">Close</a-button>
      </template>
      <TaskEditor :editor-id="'modal' + title" :editor-value="stepInfo" :editor-language="'yaml'" :is-editor="true"/>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {ProfileOutlined, PlayCircleOutlined} from '@ant-design/icons-vue'
import {inject, reactive, ref, toRefs} from "vue";
import {taskStates} from "@/utils/store";
import moment from "moment";
import TaskEditor from "@/views/TaskEditor.vue";
import cicdRepository from "@/api/cicdRepository";
import {message} from "ant-design-vue";

export default {
  name: "TaskBox",
  props: {
    title: String,
    stepInfo: Object,
    advancedDisplay: Boolean,
    projectId: Number,
  },
  components: {ProfileOutlined, PlayCircleOutlined, TaskEditor},
  setup(props: any) {
    const activeKey = ref(['0'])
    const modalTask = reactive({
      modalVisible: false,
      modalTitle: '',
    })
    const projectId = ref(inject<number>('projectId'))
    const advancedDisplay = ref(inject<boolean>('advancedDisplay'))
    const spinChange: any = inject('spinChange')

    const workflowRedo = async () => {
      try {
        const stepName = props.advancedDisplay ? props.stepInfo?.name : props.stepInfo?.redo_step
        console.log(advancedDisplay.value, projectId.value, stepName)
        spinChange(true)
        await cicdRepository.workflowRedo(props.projectId, stepName)
        message.success('redo success')
        spinChange(false)
      } catch (e) {
        spinChange(false)
        console.error(e)
      }
    }
    const showTaskEdit = () => {
      modalTask.modalVisible = true
      modalTask.modalTitle = 'Step - ' + props.title
    }
    const cancelTaskEdit = () => {
      modalTask.modalVisible = false
    }
    const timeFormat = (time: string) => {
      moment.updateLocale('en', {
        relativeTime : {
          future: "in %s",
          past:   "%s ago",
          s  : 'a few seconds',
          ss : '%d seconds',
          m:  "a minute",
          mm: "%d minutes",
          h:  "an hour",
          hh: "%d hours",
          d:  "a day",
          dd: "%d days",
          M:  "a month",
          MM: "%d months",
          y:  "a year",
          yy: "%d years"
        }
      })
      return moment(time).fromNow()
    }

    return {
      taskStates,
      activeKey,
      ...toRefs(modalTask),
      showTaskEdit,
      timeFormat,
      cancelTaskEdit,
      workflowRedo,
    }
  }
}
</script>

<style scoped lang="less">
.step-box {
  margin-top: 15px;
  button {
    background: transparent;
    border-color: #fff;
  }
  .ant-collapse {
    border: 0;
  }
  strong {
    font-weight: bolder;
  }
}
.step-box ::v-deep .ant-collapse > .ant-collapse-item > .ant-collapse-header {
  color: inherit;
  overflow: hidden;
}
.step-box ::v-deep .ant-collapse .ant-collapse-item-disabled > .ant-collapse-header, .ant-collapse .ant-collapse-item-disabled > .ant-collapse-header > .arrow {
  cursor: pointer;
}
</style>
