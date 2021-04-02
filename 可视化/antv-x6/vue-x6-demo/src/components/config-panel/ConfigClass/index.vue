<template>
  <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="属性" key="1">
      <a-row align="middle">
        <a-col :span="8">类/接口名</a-col>
        <a-col :span="16">
          <a-input v-model="name" style="width: 100%" @change="changeName()" />
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">类型</a-col>
        <a-col :span="16">
          <a-select
            default-value="Class"
            v-model="type"
            style="width: 100%"
            @change="handleChangeType"
          >
            <a-select-option value="class"> 类 </a-select-option>
            <a-select-option value="interface"> 接口 </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">属性</a-col>
        <a-col :span="16">
          <a-row>
            <a-col :span="11"> 名称 </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12"> 类型 </a-col>
          </a-row>
          <a-row v-for="(item, idx) in lists" :key="idx">
            <a-col :span="11">
              <a-input
                v-model="item.name"
                style="width: 100%"
                @change="changeField(1)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">
              <a-select v-model="item.type" style="width: 100%">
                <a-select-option
                  :value="type"
                  v-for="type in scaleTypes"
                  :key="type"
                >
                  {{ type }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row align="middle">
            <a-col :span="24">
              <a-button block @click="add"> 添加字段 </a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
  name: 'ConfigClass',
  props: {
    cellData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      scaleTypes: ['Int', 'Float', 'String', 'Boolean', 'ID', 'DateTime'],
      name: '',
      type: 'Int',
      lists: []
    }
  },
  mounted() {
    this.name = this.cellData.bxDatas.name
    this.lists = this.cellData.bxDatas.fields
    this.type = this.cellData.cellType
  },
  computed: {},
  watch: {},
  methods: {
    add() {
      this.lists.push({
        type: '',
        name: ''
      })
    },
    updateCell() {
      this.$store.dispatch('design/updateCellById', this.cellData)
    },
    handleChangeType() {
      this.cellData.cellType = this.type

      this.updateCell(this.cellData)
    },
    changeName() {
      this.cellData.bxDatas.name = this.name
      this.updateCell(this.cellData)
    },
    changeField(idx) {
      if (!this.cellData.bxDatas.fields) {
        this.cellData.bxDatas.fields = []
      }
      // this.cellData.bxDatas.fields.splice(parseInt(idx), 1, {
      //   name: this.attr[`field${idx}`],
      //   type: parseInt(Math.random() * 10) / 2 === 0 ? 'String' : 'Boolean'
      // })
    }
  }
}
</script>

<style lang="less" scoped></style>
