<template>
  <div class="project-detail">
    <CommonHeader :app-id="appId" />
    <div class="project-refresh">
      <span>自动刷新(5s)</span>
      <a-switch v-model:checked="autoRefresh" />
      <a-button :disabled="autoRefresh" @click="refresh" shape="circle"><SyncOutlined /></a-button>
    </div>
    <a-descriptions title="项目详情" bordered>
      <template #extra>
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
    <div id="tooltip" class="hidden">
      <p><span id="tooltip_value"></span></p>
    </div>
    <a-row class="project-detail-svg">
      <a-col :span="8" >
        <TaskStepsList :stepsList="stepsList" />
      </a-col>
      <a-col :span="16">
        <div id="svg">
          <svg style="width: 100%; "></svg>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import CommonHeader from "@/components/CommonHeader.vue";
import projectDetailRepositories from "@/composable/projectDetailRepositories";
import cicdRepository from "@/api/cicdRepository";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import dagreD3 from 'dagre-d3'
import * as d3 from 'd3'
import * as _ from 'lodash'
import TaskStepsList from "@/views/TaskStepsList.vue";
import {Step} from "@/utils/response";
import {taskStates} from "@/utils/store";
import {SyncOutlined} from '@ant-design/icons-vue'

export default {
  name: "ProjectDetails",
  components: { CommonHeader, TaskStepsList, SyncOutlined },
  setup() {
    const { appId, projectId, projectInfo } = projectDetailRepositories()
    const stepsList = ref<{[key: string]: Step}>({})
    const autoRefresh = ref(true)
    const timer = ref()

    const getWorkflow = async () => {
      try {
        if (projectId.value) {
          const task = await cicdRepository.queryWorkflow(projectId.value)
          const g = new dagreD3.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(function () {return {}})
          stepsList.value = task.resolution.steps
          // const nodeInfos = Object.keys(task.resolution.steps).map(t => ({id: t, label: t, color: taskStates[task.resolution.steps[t]?.state]}))
          // const edges = Object.keys(task.resolution.steps).filter(f => task.resolution.steps[f].dependencies)
          //   .map(t => task.resolution.steps[t].dependencies?.map(d => {
          //     if (d.endsWith(':ANY')) {
          //       d = d.slice(0, -4)
          //     }
          //     return ({source: d, target: t, color: taskStates[task.resolution.steps[d]?.state]})
          //   }))
          // const edgesInfos = _.flattenDeep(edges)
          // // console.log(nodeInfos, edges, edgesInfos)
          // // 添加节点
          // nodeInfos.forEach((item) => {
          //   g.setNode(item.id, {
          //     id: item.id,
          //     label: item.label,
          //     style: 'fill:' + item.color + ';stroke:' + item.color,
          //     labelStyle: 'fill: #fff',
          //     rx: 5,
          //     ry: 5,
          //   })
          // })
          // // 添加连线
          // edgesInfos.forEach(item => {
          //   g.setEdge(item.source, item.target, {
          //     style: 'stroke:' + item.color + ';fill: none',
          //     arrowheadStyle: 'fill:' + item.color + ';stroke:' + item.color,
          //     arrowhead: 'vee'
          //   })
          // })
          Object.keys(task.resolution.steps).forEach(t => {
            const state = task.resolution.steps[t].state
            let color = taskStates[state]
            const styleColor = state === 'TODO' ? '#f0f0f0' : color
            const desc = task.resolution.steps[t].description
            g.setNode(t, {
              id: t,
              label: t,
              description: desc,
              style: 'fill:' + styleColor + ';stroke:' + styleColor,
              labelStyle: state === 'TODO' ? 'fill: #000' : state === 'PRUNE' ? 'fill: grey' : 'fill: #fff',
              rx: 5,
              ry: 5,
            })
            task.resolution.steps[t].dependencies?.forEach(d => {
              let label = ''
              if (d.endsWith(':ANY')) {
                d = d.slice(0, -4)
                label = 'ANY'
                color = '#ad0067'
              }
              g.setEdge(d, t, {
                style: 'stroke:' + color + ';fill: none' ,
                arrowheadStyle: 'fill:' + color + ';stroke:' + color,
                arrowhead: 'vee',
                label: label,
              })
            })
          })
          const render = new dagreD3.render()
          const svg = d3.select('#svg svg')
          const svgGroup = svg.append('g')
          const inner = svg.select('g')
          const zoom = d3.zoom().on('zoom', function (e) { //添加鼠标滚轮放大缩小事件
            inner.attr('transform', e.transform)
          })
          svg.call(zoom as any)
          render(inner as any, g as any)
          inner.selectAll('g.node')
            .on('mouseover', (event, v: any) => {
              // console.log(event, v, g.node(v), event.target)
              // 显示提示信息：更新提示条位置和值
              const info: any = g.node(v)
              d3.select("#tooltip")
                .attr("style", "left:" + (event.pageX - 70) + "px" + ";top:" + (event.pageY - 75) + "px")
                .select("#tooltip_value")
                .text(info.description ? info.label + '-' + info.description : info.label)
              // 显示提示条
              d3.select("#tooltip").classed("hidden", false)
            }).on('mouseout', e => {
              d3.select("#tooltip").classed("hidden", true)
            })
          const graphWidth = g.graph().width as number
          const graphHeight = g.graph().height as number
          const width = parseInt(svg.style('width').replace(/px/, ''))
          const height = parseInt(svg.style('height').replace(/px/, ''))
          let initialScale = 0.75 // 缩放比例
          if (Object.keys(task.resolution.steps).length < 5) {
            initialScale = 0.9
          } else if (Object.keys(task.resolution.steps).length < 9) {
            initialScale = 0.8
          }
          svg.call(
            zoom.transform as any,
            d3.zoomIdentity
              .translate((graphWidth * initialScale) / 2 - width, 0)
              .scale(initialScale)
          )
          svg.attr('height', (g.graph().height as number) * initialScale + 40)
        }
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
    onMounted(() => {
      getWorkflow()
      watchRefresh()
    })
    onBeforeUnmount(() => {
      clearInterval(timer.value)
    })

    return {
      appId,
      projectId,
      projectInfo,
      stepsList,
      autoRefresh,
      refresh,
    }
  }
}
</script>

<style scoped lang="less">
.project-detail-svg {
  margin-top: 20px;
  padding-bottom: 16px;
  .ant-col {
    padding: 0 8px;
  }
}
.project-detail {
  padding-top: 20px;
}
.project-refresh {
  margin-bottom: 6px;
  button {
    margin-left: 10px;
  }
}
#tooltip {
  position: absolute;
  width: auto;
  height: auto;
  padding: 10px;
  background-color: #000;
  opacity: 0.75;
  color: #fff;
  text-align: center;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  font-size: 12px;
  -webkit-box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4);
  -moz-box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4);
  box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4);
  pointer-events: none;
  z-index: 10;
}

#tooltip.hidden {
  display: none;
}

#tooltip p {
  margin: 0;
  font-family: sans-serif;
  font-size: 16px;
  line-height: 20px;
}
</style>
