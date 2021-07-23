<template>
  <div :id="editorId" class="editor-task" style="height: 400px;"></div>
</template>

<script lang="ts">
import * as monaco from 'monaco-editor'
import {onMounted, ref} from "vue"

export default {
  name: "TaskEditor",
  props: {
    editorId: String,
    editorValue: Object || String,
    editorLanguage: {
      type: String,
      default: 'json',
    },
    isEditor: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: any) {
    const editor = ref()

    const initEditor = () => {
      const id = document.getElementById(props.editorId)
      if (id) {
        editor.value = monaco.editor.create(id, {
          value: JSON.stringify(props.editorValue, null, 4), //编辑器初始显示文字
          language: props.editorLanguage,
          automaticLayout: true,
          readOnly: true,
          selectOnLineNumbers: true,
          foldingStrategy: 'indentation',
          scrollBeyondLastLine: false,
          scrollbar: {
            vertical: 'hidden',
          },
          theme: 'vs'
        }).getContentHeight()
        if (!props.isEditor) {
          id.style.height = editor.value  + 18 + 'px'
        }
        // console.log(editor.value, props.editorValue, JSON.stringify(props.editorValue, null, 2))
      }
    }
    onMounted(() => {
      initEditor()
    })

    return {
      // editor,
    }
  }
}
</script>

<style scoped lang="less">
.editor-task {
  display: block;
  overflow: hidden;
  border: 1px solid #d9d9d9;
}
</style>
