<!--
  FilePath: \src\views\design\module\CollapseItem.vue
  Project: page-design-demo
  CreatedAt: 2021-04-08 10:03:08
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <draggable
    tag="ul"
    :value="list"
    v-bind="{
      group: { name: 'form-draggable', pull: 'clone', put: false },
      sort: false,
      animation: 180,
      ghostClass: 'moving'
    }"
  >
    <li
      v-for="(val, index) in list"
      :key="index"
      @dblclick="$emit('handleListPush', val)"
    >
      <!-- <svg v-if="val.icon" class="icon" aria-hidden="true">
        <use :xlink:href="`#${val.icon}`"></use>
      </svg> -->
      {{ val.custom.name }}
    </li>
  </draggable>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'CollapseItem',
  props: ['list'],
  inheritAttrs: false,
  components: {
    draggable
  },
  methods: {
    handleStart(widgetConfig) {
      this.$emit('start', widgetConfig)
    }
  }
}
</script>
