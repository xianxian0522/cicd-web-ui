<template>
  <div :id="editorId" style="height: 300px"></div>
</template>

<script lang="ts">
import * as monaco from 'monaco-editor'
import {onMounted, ref} from "vue";

export default {
  name: "TaskEditor",
  props: {
    editorId: String,
    editorValue: String,
  },
  setup(props: any) {
    const editor = ref()

    const initEditor = () => {
      const id = document.getElementById(props.editorId)
      if (id) {
        editor.value = monaco.editor.create(id, {
          value: '', //编辑器初始显示文字
          language: 'json',
          automaticLayout: true,
          readOnly: true,
          selectOnLineNumbers: true,
          theme: 'vs' //官方自带三种主题vs, hc-black, or vs-dark
        })
        editor.value.setValue('roundedSelection')
      }
    }
    onMounted(() => {
      initEditor()
    })

    return {
      editor,
    }
  }
}
</script>

<style scoped lang="less">

</style>
