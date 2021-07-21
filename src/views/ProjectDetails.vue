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
            g.setNode(t, {
              id: t,
              label: t,
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
              const toolTip = d3.select('g#' + v + '.node')
                .append('div')
                .classed('tooltip', true)
                .style('opacity', 0)
                .style('display', 'none')
              tipVisible(toolTip, g.node(v).label + '')
            }).on('mouseout', e => {
              tipHidden();
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

    const createTooltip = () => {
      return d3.select('#svg')
        .append('div')
        .classed('tooltip', true)
        .style('opacity', 0)
        .style('display', 'none');
    }
    const tipVisible = (tooltip: any, textContent: string) => {
      // const tooltip = createTooltip()
      // console.log(d3, '......======')
      tooltip.transition()
        .duration(400)
        .style('opacity', 0.9)
        .style('display', 'block');
      tooltip.html(textContent)
        .style('left', '700px')
        .style('top', '500px');
    }
    const tipHidden = () => {
      const tooltip = createTooltip()
      tooltip.transition()
        .duration(400)
        .style('opacity', 0)
        .style('display', 'none');
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
.tooltip {
  position: absolute;
  font-size: 12px;
  text-align: center;
  background-color: white;
  border-radius: 3px;
  box-shadow: rgb(174, 174, 174) 0 0 10px;
  cursor: pointer;
  display: inline-block;
  padding: 10px;
}

.tooltip>div {
  padding: 10px;
}
</style>
