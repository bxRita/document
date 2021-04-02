<template>
  <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="属性" key="1">
      <a-row align="middle">
        <a-col :span="8">枚举名</a-col>
        <a-col :span="14">
          <a-input v-model="name" style="width: 100%" @change="changeName()" />
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">枚举值</a-col>
        <a-col :span="14">
          <a-row v-for="(ev, idx) in lists" :key="idx">
            <a-col>
              <a-input
                style="width: 100%"
                :value="ev"
                @change="changeField(idx, $event)"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="2"></a-col>
        <a-col :span="20">
          <a-button block @click="add"> 添加枚举值 </a-button>
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
  name: 'ConfigEnum',
  props: {
    cellData: {
      type: Object,
      default: () => {
        return {
          name: '',
          fields: []
        }
      }
    }
  },
  data() {
    return {
      name: '',
      lists: [],
      timer: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.name = this.cellData.bxDatas.name
    this.lists = this.cellData.bxDatas.fields
  },
  methods: {
    add() {
      this.lists.push(' ')
    },
    // 更新store中节点数据
    updateCell() {
      this.$store.dispatch('design/updateCellById', this.cellData)
    },
    /**
     * @description 修改名称事件
     */
    changeName() {
      this.cellData.bxDatas.name = this.name
      this.updateCell(this.cellData)
    },
    /**
     * @description 修改枚举属性
     */
    changeField(idx, e) {
      if (this.timer) clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        if (!this.cellData.bxDatas.fields) {
          this.cellData.bxDatas.fields = []
        }
        this.cellData.bxDatas.fields.splice(parseInt(idx), 1, e.target.value)
        // 数据更新
        this.updateCell(this.cellData)
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped></style>
