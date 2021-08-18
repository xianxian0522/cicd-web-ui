<template>
  <div>
    <a-row class="project-detail-svg">
      <a-col :span="8" >
        <TaskStepsList :stepsList="stepsList" ref="taskRef" :advanced-display="advancedDisplay" :project-id="projectId"/>
      </a-col>
      <a-col :span="16" >
        <div :id="svgId" style="height: 100%"></div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import {onMounted, ref, watch} from "vue";
import TaskStepsList from "@/views/TaskStepsList.vue";
import {taskStates} from "@/utils/store";
import G6 from "@antv/g6";

export default {
  name: "TaskCanvas",
  props: {
    stepsList: Object,
    advancedDisplay: Boolean,
    projectId: Number,
    svgId: String,
  },
  components: { TaskStepsList },
  setup(props: any) {
    const taskData = ref()
    const edgeSelect = ref()
    const nodeEdge = ref<string[]>([])
    const taskRef = ref()
    const container = ref()
    const graph = ref()

    const getData = () => {
      registerNode()
      const nodes: any = []
      const edges: any = []
      Object.keys(props.stepsList).forEach((key: string) => {
        const color = taskStates[props.stepsList[key].state]
        nodes.push({
          id: key,
          name: key,
          desc: props.stepsList[key].description,
          state: props.stepsList[key].state,
        })
        props.stepsList[key].dependencies?.forEach((d: string) => {
          let label = ''
          if (d.endsWith(':ANY')) {
            d = d.slice(0, -4)
            label = 'ANY'
          }
          edges.push({
            source: d,
            target: key,
            type: 'polyline',
            label: label,
            style: {
              stroke: color,
            }
          })
        })
      })
      taskData.value = {
        nodes,
        edges
      }
    }
    const labelStyleColor = (state: string) => {
      if (state === 'TODO') {
        return '#000'
      } else if (state === 'PRUNE') {
        return 'grey'
      } else {
        return '#fff'
      }
    }
    const setNodeOpacity = (arr: string[]) => {
      const autoPaint = graph.value.get('autoPaint')
      graph.value.setAutoPaint(false)
      Object.keys(props.stepsList).forEach(node => {
        graph.value?.clearItemStates(node)
        graph.value?.setItemState(node, 'noSelected', true)
        if (arr.includes(node) || arr.length === 0) {
          graph.value?.setItemState(node, 'showed', true)
        }
      })
      graph.value.paint()
      graph.value.setAutoPaint(autoPaint)
    }
    const setEdgeOpacity = () => {
      const autoPaint = graph.value.get('autoPaint')
      graph.value.setAutoPaint(false)
      const edges = graph.value.getEdges()
      edges.forEach((edge: any) => {
        graph.value?.clearItemStates(edge)
        graph.value?.setItemState(edge, 'noSelected', true)
        if (!edgeSelect.value || edge._cfg.source._cfg.id === edgeSelect.value ||
          edge._cfg.target._cfg.id === edgeSelect.value) {
          graph.value?.setItemState(edge, 'showed', true)
        }
      })
      graph.value.paint()
      graph.value.setAutoPaint(autoPaint)
    }
    const nodeClick = (evt: any) => {
      const item = evt.item
      const id = item._cfg.id
      const edges = item._cfg.edges
      let arr: string[] = []
      if (edgeSelect.value === id) {
        edgeSelect.value = ''
        arr = []
        taskRef.value?.exactFilter(id, false)
      } else {
        edgeSelect.value = id
        edges.forEach((edge: any) => {
          if (edge._cfg.source._cfg.id === id) {
            arr.push(edge._cfg.target._cfg.id)
          }
          if (edge._cfg.target._cfg.id === id) {
            arr.push(edge._cfg.source._cfg.id)
          }
        })
        arr.push(id)
        taskRef.value?.exactFilter(id, true)
      }
      nodeEdge.value = arr
      setNodeOpacity(arr)
      setEdgeOpacity()
    }
    const registerNode = () => {
      G6.registerNode(
        'workflow',
        {
          drawShape(cfg: any, group: any) {
            let color = taskStates[cfg.state]
            const styleColor = cfg.state === 'TODO' ? '#f0f0f0' : color
            const rectWidth = cfg.name.length * 10 + 4
            const rect = group.addShape('rect', {
              attrs: {
                x: -(rectWidth / 2),
                y: -20,
                width: rectWidth,
                height: 40,
                radius: 10,
                stroke: styleColor,
                fill: styleColor,
                lineWidth: 1,
              },
              name: 'rect-shape',
            });
            if (cfg.name) {
              group.addShape('text', {
                attrs: {
                  text: cfg.name,
                  x: 0,
                  y: 0,
                  fill: labelStyleColor(cfg.state),
                  fontSize: 16,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  fontWeight: 'bold',
                },
                name: 'text-shape',
              });
            }
            return rect;
          },
        },
        'single-node',
      )
    }
    const getCanvas = () => {
      getData()

      container.value = document.getElementById(props.svgId)
      const width = container.value?.scrollWidth;
      const height = container.value?.scrollHeight || 500;
      graph.value = new G6.Graph({
        container: props.svgId,
        width,
        height,
        layout: {
          type: 'dagre',
          nodesepFunc: (d: any) => {
            const len = d.name.length
            return len > 15 ? 100 : 50
          },
          ranksep: 30,
          controlPoints: true,
        },
        defaultNode: {
          type: 'workflow',
        },
        defaultEdge: {
          style: {
            radius: 20,
            offset: 45,
            endArrow: true,
            lineWidth: 2,
          },
        },
        nodeStateStyles: {
          noSelected: {
            opacity: 0.3
          },
          showed: {
            opacity: 1
          }
        },
        edgeStateStyles: {
          noSelected: {
            opacity: 0.3
          },
          showed: {
            opacity: 1
          }
        },
        modes: {
          default: [
            'drag-canvas',
            'click-select',
            {
              type: 'zoom-canvas',
            },
            {
              type: 'tooltip',
              formatText(model: any) {
                return model.desc ? model.name + '-' + model.desc : model.name
              },
              offset: 10,
            },
          ],
        },
      })
      graph.value.on('node:click', nodeClick)
      graph.value.data(taskData.value)
      graph.value.render()
      graph.value.zoom(zoomScale())
      graph.value.translate(100, 10)

    }
    const zoomScale = () => {
      const len = Object.keys(props.stepsList).length
      if (len <= 5) {
        return 0.7
      }
      if (len <= 10) {
        return 0.6
      }
      if (len < 20) {
        return 0.5
      }
      return 0.4
    }
    const canvasChange = () => {
      //在拉取新数据重新渲染页面之前先获取点（0,0）在画布上的位置以及缩放比例
      const lastPoint = graph.value.getCanvasByPoint(0, 0)
      const zoom = graph.value.getZoom()
      getData()
      graph.value.data(taskData.value)
      graph.value.render()
      //获取重新渲染之后点（0,0）在画布的位置
      const newPoint = graph.value.getCanvasByPoint(0, 0)
      graph.value.zoom(zoom)
      graph.value.translate(lastPoint.x - newPoint.x, lastPoint.y - newPoint.y)

      setNodeOpacity(nodeEdge.value)
      setEdgeOpacity()
    }
    onMounted(() => {
      getCanvas()

      if (typeof window !== 'undefined') {
        window.onresize = () => {
          if (!graph.value || graph.value.get('destroyed')) return;
          if (!container.value || !container.value.scrollWidth || !container.value.scrollHeight) return;
          graph.value.changeSize(container.value.scrollWidth, container.value.scrollHeight);
        }
      }
    })

    watch(() => props.stepsList, () => {
      nodeEdge.value = []
      edgeSelect.value = ''
      canvasChange()
    })

    return {
      taskRef,
    }
  }
}
</script>

<style lang="less">
.project-detail-svg {
  margin-top: 20px;
  padding-bottom: 16px;
  .ant-col {
    padding: 0 8px;
  }
}
.g6-tooltip {
  border-radius: 6px;
  font-size: 14px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 5px 10px;
  text-align: center;
}
</style>

