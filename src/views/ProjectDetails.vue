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
import {Step} from "@/utils/response";

export default {
  name: "ProjectDetails",
  components: { CommonHeader },
  setup() {
    const { appId, projectId, projectInfo } = projectDetailRepositories()
    // const stepsSortData = ref<{[key: string]: any}>({})
    const stepsSortData = ref<any[]>([])

    const sortSteps = (steps: any, str?: string) => {
      // if (!str) {
      //   const startStr = Object.keys(steps).filter(t => !steps[t].dependencies)?.[0]
      //   stepsSortData.value[startStr]= steps[startStr]
      //   sortSteps(steps, startStr)
      // } else {
      //   // console.log(str, steps[str])
      //   Object.keys(steps).forEach(s => {
      //     if (steps[s].dependencies?.includes(str)) {
      //       stepsSortData.value[s]= steps[s]
      //       sortSteps(steps, s)
      //     }
      //     return
      //   })
      // }
      if (!str) {
        const startStr = steps.filter((t: any)=> !t.value.dependencies)?.[0]
        stepsSortData.value.push(startStr)
        sortSteps(steps, startStr.name)
      } else {
        steps.forEach((s: any) => {
          if (s.value.dependencies?.includes(str)) {
            if (!stepsSortData.value.includes(s)) {
              stepsSortData.value.push(s)
            }
          }
        })
        steps.forEach((s: any) => {
          if (s.value.dependencies?.includes(str)) {
            if (stepsSortData.value.includes(s)) {
              sortSteps(steps, s.name)
            }
          }
          return
        })
      }
    }

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
          const data = Object.keys(task.resolution.steps).map(t => ({name: t, value: task.resolution.steps[t]}))
          sortSteps(data)
          console.log(stepsSortData.value, '===>>>')
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
                style: 'stroke:' + color + ';fill:' + color ,
                arrowheadStyle: 'fill:' + color + ';stroke:' + color,
                arrowhead: 'vee'
              })
            })
          })
          // stepsSortData.value.forEach(t => {
          //   const color = taskStates[t.value.state]
          //   g.setNode(t.name, {
          //     id: t.name,
          //     label: t.name,
          //     style: 'fill:' + color + ';stroke:' + color,
          //     labelStyle: 'fill: #fff',
          //     rx: 5,
          //     ry: 5,
          //   })
          //   t.value.dependencies?.forEach((d: string) => {
          //     if (d.endsWith(':ANY')) {
          //       d = d.slice(0, -4)
          //     }
          //     g.setEdge(d, t.name, {
          //       style: 'stroke:' + color + ';fill:' + color ,
          //       arrowheadStyle: 'fill:' + color + ';stroke:' + color,
          //       arrowhead: 'vee'
          //     })
          //   })
          // })
          console.log(g)
          const render = new dagreD3.render()
          const svg = d3.select('#svg svg')
          const svgGroup = svg.append('g')
          const inner = svg.select('g')
          const zoom = d3.zoom().on('zoom', function (e) { //添加鼠标滚轮放大缩小事件
            inner.attr('transform', e.transform)
          })
          svg.call(zoom as any)
          render(inner as any, g as any)
          inner.selectAll('g.node').on('click', e => {
            //点击事件
            console.log(e.target);
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

    const dagre = () => {
      const g = new dagreD3.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(function () {return {}})
      const list = {
        //节点
        nodeInfos: [
          {
            id: "create_gitlab_branch",
            label: "节点-create_gitlab_branch",
          },
          {
            id: "create_jenkins_job",
            label: "节点-create_jenkins_job",
          },
          {
            id: "create_sonarqube_project",
            label: "节点-create_sonarqube_project",
          },
          {
            id: "after_prepare",
            label: "节点-after_prepare",
          },
          {
            id: 'create_jenkins_sonarqube_job',
            label: '节点-create_jenkins_sonarqube_job'
          },
          {
            id: 'commit_id',
            label: '节点-commit_id',
          }
        ],
          //节点之间的连线
        edges: [
          {
            source: "create_gitlab_branch",
            target: "create_jenkins_job",
          },
          {
            source: "create_gitlab_branch",
            target: "create_sonarqube_project",
          },
          {
            source: "create_gitlab_branch",
            target: "after_prepare",
          },
          {
            source: "create_jenkins_job",
            target: "after_prepare",
          },
          {
            source: "create_sonarqube_project",
            target: "after_prepare",
          },
          {
            source: "create_sonarqube_project",
            target: "create_jenkins_sonarqube_job",
          },
          {
            source: "create_jenkins_sonarqube_job",
            target: "after_prepare",
          },
          {
            source: "after_prepare",
            target: "commit_id",
          },
        ]
      }
      //添加节点
      list.nodeInfos.forEach((item) => {
        g.setNode(item.id, {
          id: item.id,
          label: item.label,
          style: 'fill:' + 'green' + ';stroke: green;',
          labelStyle: 'fill: #fff',
        })
      })
      //添加连线
      list.edges.forEach(item => {
        g.setEdge(item.source, item.target, {
          style: "stroke: #0fb2cc; fill: none;",
          arrowheadStyle: "fill: #0fb2cc;stroke: #0fb2cc;",
          arrowhead: 'vee'
        })
      })
      g.nodes().forEach(function(v) {
        const node = g.node(v)
        node.rx = node.ry = 5
        console.log(node, '[[[[[[')
      })
      console.log(g, '====')
      const taskStates = [
        {
          color: '#dc3545',
          key: 'BLOCKED',
          label: 'blocked',
        },
        {
          color: '#fd7e14',
          key: 'CANCELLED',
          label: 'cancelled',
        },
        {
          color: '#28a745',
          key: 'DONE',
          label: 'done',
        },
        {
          color: '#007bff',
          key: 'RUNNING',
          label: 'running',
        },
        {
          color: '#005ff0',
          key: 'TODO',
          label: 'todo',
        },
        {
          color: '#f06e20',
          key: 'WONTFIX',
          label: 'wontfix',
        },
      ]
      const render = new dagreD3.render()
      const svg = d3.select('#svg svg')
      const svgGroup = svg.append('g')
      const inner = svg.select('g')
      const zoom = d3.zoom().on('zoom', function (e) { //添加鼠标滚轮放大缩小事件
        inner.attr('transform', e.transform)
      })
      svg.call(zoom as any)
      render(inner as any, g as any)
      inner.selectAll('g.node').on('click', e => {
        //点击事件
        const code = list.nodeInfos.filter(item => {
          return item.id == e
        });
        console.log(code, e.target);
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

    onMounted(() => {
      getWorkflow()
      // dagre()
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
</style>
