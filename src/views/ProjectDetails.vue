<template>
  <div class="project-detail">
    <!--  放在外面 做遮罩层-->
    <div class="spin" v-if="spinning">
      <span class="spin-dot spin-dot-spin">
        <em class="spin-dot-item"></em>
        <em class="spin-dot-item"></em>
        <em class="spin-dot-item"></em>
        <em class="spin-dot-item"></em>
      </span>
    </div>
    <div :class="{'spin-blur': spinning}">
      <CommonHeader :app-id="appId" />
      <div class="project-refresh">
        <span>自动刷新(5s)</span>
        <a-switch v-model:checked="autoRefresh" />
        <a-button :disabled="autoRefresh" @click="refresh" shape="circle"><SyncOutlined /></a-button>
        <span style="display: inline-block; margin-left: 10px">高级展示</span>
        <a-switch v-model:checked="advancedDisplay" />
      </div>
      <CommonTicket :project-id="projectId" />
      <a-descriptions title="项目详情" bordered class="project-description">
        <template #extra>
          <a-popconfirm
            title="确定开发完成吗?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirmSuccess"
            :disabled="!enableConfirmSuccess()"
          >
            <a-button :disabled="!enableConfirmSuccess()">确认开发完成</a-button>
          </a-popconfirm>
          <a-popconfirm
            title="确定放弃开发任务吗?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="confirmClose"
            :disabled="!enableConfirmSuccess()"
          >
            <a-button :disabled="!enableConfirmSuccess()">放弃开发任务</a-button>
          </a-popconfirm>
          <a-button type="primary">
            <router-link :to="{name: 'project', params: {appId, projectId}}">返回详情列表</router-link>
          </a-button>
        </template>
        <a-descriptions-item label="基本分支">{{ projectInfo?.base_branch }}</a-descriptions-item>
        <a-descriptions-item label="分支名">{{ projectInfo?.branch_name }}</a-descriptions-item>
        <a-descriptions-item label="comment">{{ projectInfo?.comment }}</a-descriptions-item>
        <a-descriptions-item label="版本名">{{ projectInfo?.version_name }}</a-descriptions-item>
        <a-descriptions-item label="创建人" :span="2">{{ projectInfo?.create_by_username }}</a-descriptions-item>
      </a-descriptions>
<!--      <div v-if="Object.keys(stepsList)?.length > 0" >-->
<!--        <TaskSvg :steps-list="stepsList" :advanced-display="advancedDisplay"/>-->
<!--      </div>-->
      <div v-if="Object.keys(stepsList)?.length > 0">
        <TaskFlow :stepsList="stepsList" :advancedDisplay="advancedDisplay" :svg-id="'cicdSvg'"/>
      </div>
    </div>

    <a-modal
      v-model:visible="modalVisible"
      title="Jenkins build console"
      width="100%"
      wrapClassName="full-modal"
    >
      <template #footer>
        <a-button key="back" @click="modalVisible = false">取消</a-button>
      </template>
      <div ref="consoleRef">
        <pre ><code>{{ modalContent }}</code></pre>
        <a-spin v-if="modalLoading" />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import CommonHeader from "@/components/CommonHeader.vue";
import projectDetailRepositories from "@/composable/projectDetailRepositories";
import cicdRepository from "@/api/cicdRepository";
import {nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, toRefs, watch} from "vue";
import TaskSvg from "@/views/TaskSvg.vue";
import {Step} from "@/utils/response";
import {SyncOutlined} from '@ant-design/icons-vue'
import CommonTicket from "@/components/CommonTicket.vue";
import * as monaco from 'monaco-editor'
import {message} from "ant-design-vue";

export default {
  name: "ProjectDetails",
  components: {
    CommonHeader,
    // TaskSvg,
    CommonTicket,
    SyncOutlined
  },
  setup() {
    const { appId, projectId, projectInfo } = projectDetailRepositories()
    const stepsList = ref<{[key: string]: Step}>({})
    const autoRefresh = ref(true)
    const advancedDisplay = ref(false)
    const timer = ref()
    const spinning = ref(false)
    const modalState = reactive({
      modalVisible: false,
      modalContent: '',
      modalLoading: true,
    })
    const consoleRef = ref()
    provide('advancedDisplay', advancedDisplay)
    provide('projectId', projectId)

    const spinChange = (value: boolean) => {
      spinning.value = value
      if (autoRefresh.value) {
        if (value) {
          clearInterval(timer.value)
        } else {
          watchRefresh()
        }
      }
    }
    const workflowRedo = async (stepName: string) => {
      try {
        spinChange(true)
        await cicdRepository.workflowRedo(projectId.value, stepName)
        spinChange(false)
        message.success('redo success')
      } catch (e) {
        spinChange(false)
        console.error(e)
      }
    }
    const jenkinsConsoleChange = (jobName: string, buildNum: string) => {
      modalState.modalVisible = true
      modalState.modalContent = ''
      watchJenkinsConsole(jobName, buildNum, 0)
    }
    // // task-box组件触发
    // provide('spinChange', spinChange)
    provide('jenkinsConsoleChange', jenkinsConsoleChange)
    provide('monaco', monaco)
    provide('isRedo', true)
    provide('workflowRedo', workflowRedo)

    const watchJenkinsConsole = async (jobName: string, buildNum: string, start: number) => {
      try {
        const data = await cicdRepository.queryJenkinsBuildConsole(projectId.value, jobName, buildNum, start)
        start = data?.Offset
        modalState.modalContent = modalState.modalContent + data.Content
        await nextTick(() => {
          // const id = document.getElementById('console')
          // if (id) {
          //   id.scrollTop = id?.scrollHeight
          //   console.log(id?.offsetHeight, id?.scrollHeight, id.scrollTop, id)
          // }
          consoleRef.value.scrollTop = consoleRef.value?.scrollHeight
          console.log(consoleRef.value, consoleRef.value.scrollTop, consoleRef.value?.scrollHeight)
        })
        if (data?.HasMoreText) {
          setTimeout(async () => {
            await watchJenkinsConsole(jobName, buildNum, start)
          }, 3000)
        } else {
          modalState.modalLoading = false
        }
      } catch (e) {
        console.error(e)
      }
    }
    const getWorkflow = async () => {
      try {
        if (projectId.value) {
          const task = await cicdRepository.queryWorkflow(projectId.value)
          stepsList.value = advancedDisplay.value ? task.resolution.steps : task.display_resolution.steps

        }
      } catch (e) {
        console.error(e)
      }
    }
    const enableConfirmSuccess = () => {
      return stepsList.value?.['confirm_ok']?.state === 'BLOCKED';
    }
    const confirmSuccess = async () => {
      try {
        await cicdRepository.confirmProjectWorkflowStep(projectId.value, 'confirm_ok', 'YES')
        refresh()
      } catch (e) {
        console.error(e)
      }
    }
    const confirmClose = async () => {
      try {
        await cicdRepository.confirmProjectWorkflowStep(projectId.value, 'confirm_ok', 'NO')
        refresh()
      } catch (e) {
        console.error(e)
      }
    }

    const refresh = () => {
      getWorkflow()
    }
    const watchRefresh = () => {
      timer.value = setInterval(() => {
        if (autoRefresh.value) {
          getWorkflow()
        } else {
          clearInterval(timer.value)
        }
      }, 5000)
    }
    watch(autoRefresh, value => {
      if (value) {
        watchRefresh()
      }
    })
    watch(advancedDisplay, value => {
      getWorkflow()
    })
    onMounted(() => {
      getWorkflow()
      watchRefresh()
    })
    onBeforeUnmount(() => {
      clearInterval(timer.value)
    })
    watch(() => modalState.modalContent , () => {
      nextTick(() => {
        // const el = document.getElementById('console')
        // if (el) {
        //   el.scrollTop = el.scrollHeight
        //   console.log(el.offsetHeight, el.scrollHeight, el.scrollTop, el)
        // }
      })
    })

    return {
      appId,
      projectId,
      projectInfo,
      stepsList,
      autoRefresh,
      advancedDisplay,
      spinning,
      ...toRefs(modalState),
      consoleRef,
      refresh,
      confirmSuccess,
      confirmClose,
      enableConfirmSuccess,
    }
  }
}
</script>

<style lang="less" >
.project-detail {
  padding-top: 20px;
}
.project-refresh {
  margin-bottom: 15px;
  button {
    margin-left: 10px;
  }
}
.project-description {
  button {
    margin-left: 10px;
  }
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
    overflow: auto;
  }
}

.spin {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  display: block;
  width: 100%;
  height: 100%;
  max-height: 400px;
}
.spin-dot {
  position: absolute;
  top: 50%;
  left: calc(50% + 100px);
  margin: -10px;
  display: inline-block;
  font-size: 20px;
  width: 1em;
  height: 1em;
}
.spin-dot-spin {
  transform: rotate(45deg);
  animation: antRotate 1.2s infinite linear;
}
.spin-dot-item {
  position: absolute;
  display: block;
  width: 9px;
  height: 9px;
  background-color: #1890ff;
  border-radius: 100%;
  transform: scale(.75);
  transform-origin: 50% 50%;
  opacity: .3;
  animation: antSpinMove 1s infinite linear alternate;
}
.spin-dot-item:nth-child(1) {
  top: 0;
  left: 0;
}
.spin-dot-item:nth-child(2) {
  top: 0;
  right: 0;
  animation-delay: .4s;
}
.spin-dot-item:nth-child(3) {
  right: 0;
  bottom: 0;
  animation-delay: .8s;
}
.spin-dot-item:nth-child(4) {
  bottom: 0;
  left: 0;
  animation-delay: 1.2s;
}
.spin-blur {
  clear: both;
  overflow: hidden;
  opacity: .5;
  user-select: none;
  pointer-events: none;
}
</style>
