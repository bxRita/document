
<template>
  <div class="full-page-ag-grid">
    <ag-grid
      :gridOptions="gridOptions"
      :modules="modules"
      class="ag-theme-material full-size"
      v-bind="$attrs"
    ></ag-grid>
  </div>
</template>

<script src="./full-page-ag-grid.js">
</script>

<style lang="scss" scoped>
.full-page-ag-grid {
  flex: 1 1 auto;
  overflow: hidden;
  .full-size {
    width: 100%;
    height: 100%;
  }
}
</style>
