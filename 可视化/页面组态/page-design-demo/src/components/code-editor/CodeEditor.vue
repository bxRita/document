<!--
  FilePath: \src\components\code-editor\CodeEditor.vue
  Project: page-design-demo
  CreatedAt: 2021-04-14 17:28:25
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<script>
import * as monaco from 'monaco-editor'

let monacoEditor = null

const dataTypeMap = {
  '[object Object]': {},
  '[object Array]': [],
  '[object Function]': function noop() {},
  '[object String]': '',
  '[object Number]': 1,
  '[object Null]': null,
  '[object Undefined]': undefined
}
// 单行注释Reg
const singleLineComment = /(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g
// 多行注释Reg
const multiLineComment = /(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g
export default {
  name: 'CodeEditor',
  inheritAttrs: false,
  props: {
    codeContent: String,
    language: {
      type: String,
      default: 'javascript'
    },
    type: String,
    readOnly: Boolean
  },
  components: {},
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      monacoEditor = monaco.editor.create(
        document.getElementById('codeEditor'),
        {
          // 相关配置项说明： https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandaloneeditorconstructionoptions.html
          value: this.setValue(this.codeContent || ''),
          language: this.language,
          automaticLayout: true, //自动布局
          // theme: 'vs-dark', //官方自带三种主题vs, hc-black, or vs-dark
          selectOnLineNumbers: true, //显示行号
          quickSuggestionsDelay: 500, //代码提示延时
          cursorStyle: 'line', //光标样式
          readOnly: this.readOnly,
          fontSize: 13 //字体大小
        }
      )
      // window.Uidesigner.$event.trigger('open_code_editor', true)
      // 格式化代码
      this.formatDocument()
    })
  },
  watch: {
    codeContent(newValue) {
      if (newValue && monacoEditor) {
        monacoEditor.setValue(this.setValue(newValue))
      }
    }
  },
  methods: {
    setValue(value) {
      if (this.language === 'json') {
        value = '// Tips:请严格按照json数据格式进行编写\n' + value
      } else if (this.language === 'javascript') {
        value = '// Tips:请严格按照Javascript语法进行编写\n' + value
      }
      return value
    },
    getValue() {
      try {
        if (monacoEditor) {
          const codeValue = monacoEditor
            .getValue()
            .replace(singleLineComment, '') /*.replace(multiLineComment, '')*/
          // 返回函数类型
          if (this.type === '[object Function]') {
            return new Function(`return ${codeValue}`)()
          }
          // 返回对象 数组类型
          return JSON.parse(codeValue)
        }
        return dataTypeMap[this.type]
      } catch (error) {
        return error
      }
    },
    formatDocument() {
      setTimeout(() => {
        monacoEditor.trigger('anyString', 'editor.action.formatDocument')
      }, 300)
    }
  },
  destroyed() {
    // window.Uidesigner.$event.trigger('open_code_editor', false)
    monacoEditor.dispose()
    monacoEditor = null
  },
  render(h) {
    return <div id="codeEditor" class="code-editor"></div>
  }
}
</script>

<style lang="less">
.code-editor {
  width: 100%;
  height: 100%;
}
</style>
