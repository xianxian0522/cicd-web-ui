<template>
  <div>
    <a-select
      v-model:value="stepSelect"
      mode="tags"
      style="width: 100%"
      placeholder="Filter Steps"
      @change="FilterSteps"
    >
      <a-select-option value="todo">State: TODO</a-select-option>
      <a-select-option value="done">State: DONE</a-select-option>
      <a-select-option value="blocked">State: BLOCKED</a-select-option>
    </a-select>
    <div class="steps-list">
      <TaskBox v-for="step in taskSteps" :key="step.name" :title="step.name" :step-info="step.value" />
    </div>
  </div>
</template>

<script lang="ts">
import {ref, watch} from "vue";
import TaskBox from "@/views/TaskBox.vue";
import {Step} from "@/utils/response";

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

    const FilterSteps = (input: string[], option: string) => {
      console.log(input, option, props.stepsList)
      let arr: string[] = []
      input.forEach(str => {
        const filter = Object.keys(props.stepsList)
          .filter(f => props.stepsList[f].state.toLowerCase().indexOf(str.toLowerCase()) >= 0 )
        arr = arr.concat(filter)
      })
      const data = Object.keys(props.stepsList).map(s => {
        if (arr.includes(s)) {
          return ({name: s, value: props.stepsList[s]})
        }
      }).filter(und => und)
      taskSteps.value = data as TaskSteps[]
    }

    const getTaskStep = (value: {[key: string]: Step}) => {
      taskSteps.value = Object.keys(value)?.map(s => ({name: s, value: value[s]}))
    }

    watch(() => props.stepsList, value => {
      getTaskStep(value)
    })

    return {
      stepSelect,
      taskSteps,
      FilterSteps,
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
