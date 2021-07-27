<template>
  <div>
    <a-select
      v-model:value="stepSelect"
      mode="tags"
      style="width: 100%"
      placeholder="Filter Steps"
      @change="FilterSteps"
    >
      <a-select-option v-for="state in taskState" :key="state" :value="state" >State: {{ state }}</a-select-option>
    </a-select>
    <div class="steps-list">
      <TaskBox v-for="step in taskSteps" :key="step.name" :title="step.name" :step-info="step.value" />
    </div>
  </div>
</template>

<script lang="ts">
import {onMounted, ref, watch} from "vue";
import TaskBox from "@/views/TaskBox.vue";
import {Step} from "@/utils/response";
import * as _ from "lodash";

export interface TaskSteps {
  name: string;
  value: Step;
}

export default {
  name: "TaskStepsList",
  props: {
    stepsList: Object,
  },
  components: { TaskBox },
  setup(props: any) {
    const stepSelect = ref()
    const taskSteps = ref<TaskSteps[]>([])
    const taskState = ref<string[]>([])

    const exactFilter = (value: string, isExact: boolean) => {
      if (isExact) {
        const filter = Object.keys(props.stepsList).filter(f => f.toLowerCase().indexOf(value.toLowerCase()) >= 0)
        taskSteps.value = filter.map(s => ({name: s, value: props.stepsList[s]}))
        stepSelect.value = ['Step: ' + value]
      } else {
        stepSelect.value = []
        taskSteps.value = Object.keys(props.stepsList)?.map(s => ({name: s, value: props.stepsList[s]}))
      }
    }
    const filterInput = (input: string[]) => {
      let arr: string[] = []
      input.forEach(str => {
        const filter = Object.keys(props.stepsList)
          .filter(f => props.stepsList[f].state.toLowerCase().indexOf(str.toLowerCase()) >= 0 )
        arr = arr.concat(filter)
      })
      return arr
    }
    const filterTask = (input: string[]) => {
      if (input && input.length > 0) {
        let arr: string[] = []
        const includeState = input.every(str => taskState.value.includes(str))
        if (includeState) {
          arr = filterInput(input)
        } else {
          const include = input.filter(str => taskState.value.includes(str))
          const noInclude = input.filter(str => !taskState.value.includes(str))
          let arrInclude: string[] = filterInput(include)
          noInclude.forEach(str => {
            arr = arr.concat(arrInclude.filter(inc => inc.toLowerCase().indexOf(str.toLowerCase()) >= 0))
          })
        }
        const data = Object.keys(props.stepsList).map(s => {
          if (arr.includes(s)) {
            return ({name: s, value: props.stepsList[s]})
          }
        }).filter(und => und)
        taskSteps.value = data as TaskSteps[]
      } else {
        taskSteps.value = Object.keys(props.stepsList)?.map(s => ({name: s, value: props.stepsList[s]}))
      }
    }
    const FilterSteps = (input: string[]) => {
      filterTask(input)
    }

    const getTaskStep = () => {
      const value = stepSelect.value || []
      filterTask(value)
    }
    const getTaskState = () => {
      taskState.value = _.uniq(Object.keys(props.stepsList)?.map(s => props.stepsList[s].state))
    }

    onMounted(() => {
      getTaskStep()
      getTaskState()
    })

    watch(() => props.stepsList, value => {
      getTaskStep()
      getTaskState()
    })

    return {
      stepSelect,
      taskSteps,
      taskState,
      FilterSteps,
      exactFilter,
    }
  }
}
</script>

<style scoped lang="less">
.steps-list {
  overflow-y: auto;
  flex: 1;
  height: 500px;
}
</style>
