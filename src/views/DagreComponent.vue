<template>
  <div id="svg" style="margin-top: 20px">
    <svg style="width: 100%; "></svg>
  </div>
</template>

<script lang="ts">
import dagreD3 from 'dagre-d3'
import * as d3 from 'd3'
import {onMounted} from "vue";

export default {
  name: "DagreComponent",
  setup() {
    const dagre = () => {
      const g = new dagreD3.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(function () {return {}})
      const list = {
        nodeInfos: [
          {id: 'abandon_project', label: 'abandon_project'},
          {id: 'after_abandon_project', label: 'after_abandon_project'},
          {id: 'after_complete_project', label: 'after_complete_project'},
          {id: 'after_pipeline', label: 'after_pipeline'},
          {id: 'after_prepare', label: 'after_prepare'},
          {id: 'cleanup', label: 'cleanup'},
          {id: 'commit_id', label: 'commit_id'},
          {id: 'complete_project', label: 'complete_project'},
          {id: 'confirm_ok', label: 'confirm_ok'},
          {id: 'create_gitlab_branch', label: 'create_gitlab_branch'},
          {id: 'create_gitlab_tag', label: 'create_gitlab_tag'},
          {id: 'create_jenkins_job', label: 'create_jenkins_job'},
          {id: 'create_jenkins_sonarqube_job', label: 'create_jenkins_sonarqube_job'},
          {id: 'create_sonarqube_project', label: 'create_sonarqube_project'},
          {id: 'create_version', label: 'create_version'},
          {id: 'delete_jenkins_job', label: 'delete_jenkins_job'},
          {id: 'delete_jenkins_sonarqube_job', label: 'delete_jenkins_sonarqube_job'},
          {id: 'delete_sonar_project', label: 'delete_sonar_project'},
          {id: 'jenkins_build', label: 'jenkins_build'},
          {id: 'jenkins_build_queue', label: 'jenkins_build_queue'},
          {id: 'jenkins_build_result', label: 'jenkins_build_result'},
          {id: 'release_package', label: 'release_package'},
          {id: 'security_check', label: 'security_check'},
          {id: 'security_check_result', label: 'security_check_result'},
          {id: 'sonarqube_check', label: 'sonarqube_check'},
          {id: 'sonarqube_check_queue', label: 'sonarqube_check_queue'},
          {id: 'sonarqube_check_result', label: 'sonarqube_check_result'},
          {id: 'sonarqube_project_status', label: 'sonarqube_project_status'},
          {id: 'sonarqube_report', label: 'sonarqube_report'},
          {id: 'sonarqube_report_result', label: 'sonarqube_report_result'},
        ],
        //节点之间的连线
        edges: [
          {source: 'confirm_ok', target: 'abandon_project'},
          {source: 'abandon_project', target: 'after_abandon_project'},
          {source: 'release_package', target: 'after_complete_project'},
          {source: 'jenkins_build_result', target: 'after_pipeline'},
          {source: 'sonarqube_project_status', target: 'after_pipeline'},
          {source: 'security_check_result', target: 'after_pipeline'},
          {source: 'create_gitlab_branch', target: 'after_prepare'},
          {source: 'create_jenkins_job', target: 'after_prepare'},
          {source: 'create_sonarqube_project', target: 'after_prepare'},
          {source: 'create_jenkins_sonarqube_job', target: 'after_prepare'},
          {source: 'after_complete_project', target: 'cleanup'},
          {source: 'after_abandon_project', target: 'cleanup'},
          {source: 'after_prepare', target: 'commit_id'},
          {source: 'confirm_ok', target: 'complete_project'},
          {source: 'after_pipeline', target: 'confirm_ok'},
          {source: 'create_version', target: 'create_gitlab_tag'},
          {source: 'create_gitlab_branch', target: 'create_jenkins_job'},
          {source: 'create_sonarqube_project', target: 'create_jenkins_sonarqube_job'},
          {source: 'create_gitlab_branch', target: 'create_sonarqube_project'},
          {source: 'complete_project', target: 'create_version'},
          {source: 'cleanup', target: 'delete_jenkins_job'},
          {source: 'cleanup', target: 'delete_jenkins_sonarqube_job'},
          {source: 'cleanup', target: 'delete_sonar_project'},
          {source: 'commit_id', target: 'jenkins_build'},
          {source: 'jenkins_build', target: 'jenkins_build_queue'},
          {source: 'jenkins_build_queue', target: 'jenkins_build_result'},
          {source: 'create_gitlab_tag', target: 'release_package'},
          {source: 'jenkins_build_result', target: 'security_check'},
          {source: 'security_check', target: 'security_check_result'},
          {source: 'commit_id', target: 'sonarqube_check'},
          {source: 'sonarqube_check', target: 'sonarqube_check_queue'},
          {source: 'sonarqube_check_queue', target: 'sonarqube_check_result'},
          {source: 'sonarqube_report_result', target: 'sonarqube_project_status'},
          {source: 'sonarqube_check_result', target: 'sonarqube_report'},
          {source: 'sonarqube_report', target: 'sonarqube_report_result'},
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
      })
      console.log(g, '=-------')
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
      dagre()
    })
  }
}
</script>

<style scoped lang="less">

</style>
