<template>
  <div class="project-detail">
    <CommonHeader :app-id="appId" />
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
    <div id="svg" style="margin-top: 20px">
      <svg style="width: 100%; "></svg>
    </div>
  </div>
</template>

<script lang="ts">
import CommonHeader from "@/components/CommonHeader.vue";
import projectDetailRepositories from "@/composable/projectDetailRepositories";
import cicdRepository from "@/api/cicdRepository";
import {onMounted, ref} from "vue";
import dagreD3 from 'dagre-d3'
import * as d3 from 'd3'
import * as _ from 'lodash'

export default {
  name: "ProjectDetails",
  components: { CommonHeader },
  setup() {
    const { appId, projectId, projectInfo } = projectDetailRepositories()

    const getWorkflow = async () => {
      try {
        if (projectId.value) {
          const task = await cicdRepository.queryWorkflow(projectId.value)
          const g = new dagreD3.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(function () {return {}})
          const taskStates: {[key: string]: string} = {
            'BLOCKED': '#dc3545',
            'CANCELLED': '#fd7e14',
            'DONE': '#28a745',
            'RUNNING': '#007bff',
            'TODO': '#005ff0',
            'WONTFIX': '#f06e20',
          }
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
            const color = taskStates[task.resolution.steps[t].state]
            const desc = task.resolution.steps[t].description
            g.setNode(t, {
              id: t,
              label: t,
              description: desc,
              style: 'fill:' + color + ';stroke:' + color,
              labelStyle: 'fill: #fff',
              rx: 5,
              ry: 5,
            })
            task.resolution.steps[t].dependencies?.forEach(d => {
              if (d.endsWith(':ANY')) {
                d = d.slice(0, -4)
              }
              g.setEdge(d, t, {
                style: 'stroke:' + color + ';fill: none' ,
                arrowheadStyle: 'fill:' + color + ';stroke:' + color,
                arrowhead: 'vee'
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
              console.log(event, v, g.node(v), event.target)
              //显示提示信息：更新提示条位置和值
              const info: any = g.node(v)
              d3.select("#tooltip")
                .attr("style", "left:" + (event.pageX - 70) + "px" + ";top:" + (event.pageY - 75) + "px")
                .select("#tooltip_value")
                .text(info.description ? info.label + '-' + info.description : info.label)
              //显示提示条
              d3.select("#tooltip").classed("hidden", false)
            }).on('mouseout', e => {
              // d3.select("#tooltip").classed("hidden", true)
            })
          const initialScale = 1 // 缩放比例
          // svg.call(
          //   zoom.transform,
          //   d3.zoomIdentity
          //     .translate(
          //       (svg.attr('width') - g.graph().width * initialScale) / 2,
          //       20
          //     )
          //     .scale(initialScale)
          // )
          svg.attr('height', (g.graph().height as number) * initialScale + 40)
        }
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(() => {
      getWorkflow()
    })

    return {
      appId,
      projectId,
      projectInfo,
    }
  }
}
</script>

<style scoped lang="less">
.project-detail {
  padding-top: 20px;
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
