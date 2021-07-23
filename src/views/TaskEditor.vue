<template>
  <div :id="editorId" ></div>
</template>

<script lang="ts">
import * as monaco from 'monaco-editor'
import {onMounted, ref} from "vue"

export default {
  name: "TaskEditor",
  props: {
    editorId: String,
    editorValue: Object || String,
  },
  setup(props: any) {
    const editor = ref()

    const initEditor = () => {
      const id = document.getElementById(props.editorId)
      if (id) {
        editor.value = monaco.editor.create(id, {
          value: JSON.stringify(props.editorValue, null, 4), //编辑器初始显示文字
          language: 'json',
          automaticLayout: true,
          readOnly: true,
          selectOnLineNumbers: true,
          foldingStrategy: 'indentation',
          scrollbar: {
            vertical: 'hidden',
          },
          theme: 'vs' //官方自带三种主题vs, hc-black, or vs-dark
        }).getContentHeight()
        console.log(editor.value)
        id.style.height = editor.value + 'px'
        // console.log(props.editorValue, JSON.stringify(props.editorValue, null, 2))
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
