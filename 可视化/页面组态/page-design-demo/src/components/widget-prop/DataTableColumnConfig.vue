<!--
  FilePath: \src\components\widget-prop\DataTableColumnConfig.vue
  Project: page-design-demo
  CreatedAt: 2021-04-22 10:40:02
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<template>
  <div>
    <a-button size="small" @click="showModal"> 表格列管理 </a-button>
    <a-modal
      title="表格列管理"
      :visible="visible"
      width="50%"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-row>
        <a-col>
          <a-button @click="addColumn()">新增列</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-table :columns="columns" :data-source="data" rowKey="dataIndex">
            <span slot="action" slot-scope="text, record">
              <a @click="editColumn(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="deleteColumn(record)">删除</a>
            </span>
          </a-table>
        </a-col>
      </a-row>
    </a-modal>
    <ColumnForm
      v-if="columnFormOp.show"
      v-bind="columnFormOp"
      @ok="columnFormOk"
      @cancel="columnFormCancel"
    ></ColumnForm>
  </div>
</template>

<script>
import ColumnForm from './ColumnForm'
export default {
  name: 'DataTableColumnConfig',
  inheritAttrs: false,
  props: {
    columnDefs: {
      type: Array,
      default: () => []
    }
  },
  components: { ColumnForm },
  data() {
    return {
      visible: false,
      columnFormOp: {
        show: false,
        dataInfo: null
      },
      columns: [
        {
          title: '列头显示文字',
          dataIndex: 'title',
          sorter: true,
          width: '20%'
        },
        {
          title: '列宽',
          dataIndex: 'width',
          width: '20%'
        },
        {
          title: '列数据key',
          dataIndex: 'dataIndex'
        },
        {
          title: '对齐方式',
          dataIndex: 'align'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: []
    }
  },
  created() {},
  mounted() {
    this.data = this.columnDefs
  },
  methods: {
    columnFormOk(record) {
      let isEdit = !!this.columnFormOp.dataInfo
      if (!isEdit) {
        this.data.push(record)
      } else {
        let idx = this.data.findIndex(
          item => item.dataIndex === record.dataIndex
        )
        this.data.splice(idx, 1, record)
      }
      this.columnFormCancel()
    },
    columnFormCancel() {
      this.columnFormOp.show = false
      this.columnFormOp.dataInfo = null
    },
    /**
     * @description 新增列
     */
    addColumn() {
      this.columnFormOp.show = true
      this.columnFormOp.dataInfo = null
    },
    /**
     * @description 编辑列
     */
    editColumn(record) {
      this.columnFormOp.show = true
      this.columnFormOp.dataInfo = record
      console.log(record)
    },
    /**
     * @description 删除列
     */
    deleteColumn(record) {
      console.log(record)
      this.data = this.data.filter(item => item.dataIndex !== record.dataIndex)
    },
    handleOk() {
      this.visible = false
      this.$emit('change', this.data)
    },
    handleCancel() {
      this.visible = false
    },
    showModal() {
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-modal-body {
  .ant-form {
    .ant-row {
      .ant-form-item-control-wrapper {
        flex: 0 0 auto;
        float: left;
        display: block;
        box-sizing: border-box;
        width: 58.33333333%;
      }
    }
  }
}
</style>
