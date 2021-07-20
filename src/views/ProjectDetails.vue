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
import {onMounted} from "vue";
import dagreD3 from 'dagre-d3'
import * as d3 from 'd3'

export default {
  name: "ProjectDetails",
  components: { CommonHeader },
  setup() {
    const { appId, projectId, projectInfo } = projectDetailRepositories()

    const getWorkflow = async () => {
      try {
        if (projectId.value) {
          await cicdRepository.queryWorkflow(projectId.value)
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
            id: "node1",
            label: "节点1",
          },
          {
            id: "node2",
            label: "节点2",
          },
          {
            id: "node3",
            label: "节点3",
          },
          {
            id: "node4",
            label: "节点4",
          },
        ],
          //节点之间的连线
          edges: [
          {
            source: "node1",
            target: "node2",
          },
          {
            source: "node2",
            target: "node3",
          },
          {
            source: "node2",
            target: "node4",
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
      svg.call(zoom)
      render(inner, g)
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
      svg.attr('height', g.graph().height * initialScale + 40)
    }

    onMounted(() => {
      getWorkflow()
      dagre()
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
