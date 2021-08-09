<template>
  <div class="project-detail">
<!--    放在外面 做遮罩层看看-->
    <div class="spin" v-if="spinning">
      <span class="spin-dot spin-dot-spin">
        <i class="spin-dot-item"></i>
        <i class="spin-dot-item"></i>
        <i class="spin-dot-item"></i>
        <i class="spin-dot-item"></i>
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
<!--      <div id="tooltip" class="hidden">-->
<!--        <p><span id="tooltip_value"></span></p>-->
<!--      </div>-->
<!--      <a-row class="project-detail-svg">-->
<!--        <a-col :span="8" >-->
<!--          <TaskStepsList :stepsList="stepsList" ref="taskRef" :advanced-display="advancedDisplay" :project-id="projectId"/>-->
<!--        </a-col>-->
<!--        <a-col :span="16">-->
<!--          <div id="svg">-->
<!--            <svg ></svg>-->
<!--          </div>-->
<!--        </a-col>-->
<!--      </a-row>-->
      <div v-if="Object.keys(stepsList)?.length > 0">
        <TaskFlow :stepsList="stepsList" :advancedDisplay="advancedDisplay"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CommonHeader from "@/components/CommonHeader.vue";
import projectDetailRepositories from "@/composable/projectDetailRepositories";
import cicdRepository from "@/api/cicdRepository";
import {onBeforeUnmount, onMounted, provide, ref, watch} from "vue";
import dagreD3 from 'dagre-d3'
import * as d3 from 'd3'
import * as _ from 'lodash'
import TaskStepsList from "@/views/TaskStepsList.vue";
import {Step} from "@/utils/response";
import {taskStates} from "@/utils/store";
import {SyncOutlined} from '@ant-design/icons-vue'
import CommonTicket from "@/components/CommonTicket.vue";
import * as monaco from 'monaco-editor'

export default {
  name: "ProjectDetails",
  components: {
    CommonHeader,
    // TaskStepsList,
    CommonTicket,
    SyncOutlined
  },
  setup() {
    const { appId, projectId, projectInfo } = projectDetailRepositories()
    const stepsList = ref<{[key: string]: Step}>({})
    const autoRefresh = ref(true)
    const advancedDisplay = ref(false)
    const timer = ref()
    const nodeEdge = ref<string[]>([])
    const edgeSelect = ref()
    const taskRef = ref()
    const spinning = ref(false)
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
    provide('spinChange', spinChange)
    provide('monaco', monaco)

    const setNodeOpacity = (arr: string[]) => {
      Object.keys(stepsList.value).forEach(all => {
        let nodeEle = d3.select('g#' + all + '.node')
        if (arr.includes(all) || arr.length === 0) {
          nodeEle.style('opacity', 1)
        } else {
          nodeEle.style('opacity', 0.3)
        }
      })
    }
    const setEdgeOpacity = (g: dagreD3.graphlib.Graph) => {
      g.edges().forEach(edge => {
        g.edge(edge).elem.style.opacity = 1
        if (edge.v === edgeSelect.value || edge.w === edgeSelect.value || !edgeSelect.value) {
          g.edge(edge).elem.style.opacity = 1
        } else {
          g.edge(edge).elem.style.opacity = 0.3
        }
      })
    }
    const getWorkflow = async () => {
      try {
        if (projectId.value) {
          const task = await cicdRepository.queryWorkflow(projectId.value)
          stepsList.value = advancedDisplay.value ? task.resolution.steps : task.display_resolution.steps
          
          // const g = new dagreD3.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(function () {return {}})
          // // const nodeInfos = Object.keys(stepsList.value).map(t => ({id: t, label: t, color: taskStates[stepsList.value[t]?.state]}))
          // // const edges = Object.keys(stepsList.value).filter(f => stepsList.value[f].dependencies)
          // //   .map(t => stepsList.value[t].dependencies?.map(d => {
          // //     if (d.endsWith(':ANY')) {
          // //       d = d.slice(0, -4)
          // //     }
          // //     return ({source: d, target: t, color: taskStates[stepsList.value[d]?.state]})
          // //   }))
          // // const edgesInfos = _.flattenDeep(edges)
          // // // console.log(nodeInfos, edges, edgesInfos)
          // // // 添加节点
          // // nodeInfos.forEach((item) => {
          // //   g.setNode(item.id, {
          // //     id: item.id,
          // //     label: item.label,
          // //     style: 'fill:' + item.color + ';stroke:' + item.color,
          // //     labelStyle: 'fill: #fff',
          // //     rx: 5,
          // //     ry: 5,
          // //   })
          // // })
          // // // 添加连线
          // // edgesInfos.forEach(item => {
          // //   g.setEdge(item.source, item.target, {
          // //     style: 'stroke:' + item.color + ';fill: none',
          // //     arrowheadStyle: 'fill:' + item.color + ';stroke:' + item.color,
          // //     arrowhead: 'vee'
          // //   })
          // // })
          // Object.keys(stepsList.value).forEach(t => {
          //   const state = stepsList.value[t].state
          //   let color = taskStates[state]
          //   const styleColor = state === 'TODO' ? '#f0f0f0' : color
          //   const desc = stepsList.value[t].description
          //   g.setNode(t, {
          //     id: t,
          //     label: t,
          //     description: desc,
          //     style: 'fill:' + styleColor + ';stroke:' + styleColor,
          //     labelStyle: state === 'TODO' ? 'fill: #000' : state === 'PRUNE' ? 'fill: grey' : 'fill: #fff',
          //     rx: 5,
          //     ry: 5,
          //   })
          //   stepsList.value[t].dependencies?.forEach(d => {
          //     let label = ''
          //     if (d.endsWith(':ANY')) {
          //       d = d.slice(0, -4)
          //       label = 'ANY'
          //       color = '#ad0067'
          //     }
          //     g.setEdge(d, t, {
          //       style: 'stroke:' + color + ';fill: none' ,
          //       arrowheadStyle: 'fill:' + color + ';stroke:' + color,
          //       arrowhead: 'vee',
          //       label: label,
          //     })
          //   })
          // })
          // const render = new dagreD3.render()
          // const svg = d3.select('#svg svg')
          // const svgGroup = svg.append('g')
          // const inner = svg.select('g')
          // const zoom = d3.zoom().on('zoom', function (e) { //添加鼠标滚轮放大缩小事件
          //   inner.attr('transform', e.transform)
          // })
          // svg.call(zoom as any)
          // render(inner as any, g as any)
          // inner.selectAll('g.node')
          //   .on('mouseover', (event, v: any) => {
          //     // console.log(event, v, g.node(v), event.target)
          //     console.log(event, event.pageX, event.pageY, g.node(v).x, g.node(v).y)
          //     // 显示提示信息：更新提示条位置和值
          //     const info: any = g.node(v)
          //     d3.select("#tooltip")
          //       .attr("style", "left:" + (event.pageX - 70) + "px" + ";top:" + (event.screenY - 75) + "px")
          //       // .attr("style", "left:" + ((event.pageX + g.node(v).x) / 2 - 75) + "px" + ";top:" + (event.pageY + g.node(v).y + 70) + "px")
          //       .select("#tooltip_value")
          //       .text(info.description ? info.label + '-' + info.description : info.label)
          //     // 显示提示条
          //     d3.select("#tooltip").classed("hidden", false)
          //   }).on('mouseout', e => {
          //     // d3.select("#tooltip").classed("hidden", true)
          //   })
          //   .on('click', (event, v: any) => {
          //     let arr: string[] = []
          //     if (edgeSelect.value === v) {
          //       edgeSelect.value = ''
          //       arr = []
          //       taskRef.value?.exactFilter(v, false)
          //     } else {
          //       edgeSelect.value = v
          //       g.edges().forEach(edge => {
          //         if (edge.v === v) {
          //           arr.push(edge.w)
          //         }
          //         if (edge.w === v) {
          //           arr.push(edge.v)
          //         }
          //       })
          //       arr.push(v)
          //       taskRef.value?.exactFilter(v, true)
          //     }
          //
          //     nodeEdge.value = arr
          //     setNodeOpacity(nodeEdge.value)
          //     setEdgeOpacity(g)
          //   })
          // let initialScale = 0.75 // 缩放比例
          // if (Object.keys(stepsList.value).length < 5) {
          //   initialScale = 0.9
          // } else if (Object.keys(stepsList.value).length < 9) {
          //   initialScale = 0.8
          // }
          // const svgWidth = document.getElementById('svg')?.clientWidth || (g.graph().width as number) * initialScale + 40
          // svg.attr('width', svgWidth)
          // const graphWidth = g.graph().width as number
          // const graphHeight = g.graph().height as number
          // const width = parseInt(svg.style('width').replace(/px/, ''))
          // const height = parseInt(svg.style('height').replace(/px/, ''))
          // // console.log(graphWidth * initialScale, width * initialScale, graphHeight, height)
          // const attrHeight = graphHeight * initialScale < 500 ? 500 : graphHeight * initialScale
          // svg.attr('height', attrHeight + 40)
          // svg.call(
          //   zoom.transform as any,
          //   d3.zoomIdentity
          //     .translate(Math.abs(graphWidth * initialScale - width * initialScale ) / 2, 0)
          //     .scale(initialScale)
          // )
          //
          // setNodeOpacity(nodeEdge.value)
          // setEdgeOpacity(g)
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
    watch(advancedDisplay, value => {
      nodeEdge.value = []
      getWorkflow()
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
      advancedDisplay,
      taskRef,
      spinning,
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
  margin-bottom: 15px;
  button {
    margin-left: 10px;
  }
}
//.opacity {
//  opacity: 0.3 !important;
//}
//#tooltip {
//  position: absolute;
//  width: auto;
//  height: auto;
//  padding: 10px;
//  background-color: #000;
//  opacity: 0.75;
//  color: #fff;
//  text-align: center;
//  -webkit-border-radius: 10px;
//  -moz-border-radius: 10px;
//  border-radius: 10px;
//  font-size: 12px;
//  -webkit-box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4);
//  -moz-box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4);
//  box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4);
//  pointer-events: none;
//  z-index: 10;
//}
//
//#tooltip.hidden {
//  display: none;
//}
//
//#tooltip p {
//  margin: 0;
//  font-family: sans-serif;
//  font-size: 16px;
//  line-height: 20px;
//}

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
