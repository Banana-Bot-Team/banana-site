<template>
  <el-container>
    <el-header>
      <wf-menu></wf-menu>
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue';
import WFMenu from '@/components/interfaces/wf-menu.vue';
export default Vue.extend({
  components: {
    'wf-menu': WFMenu
  }
});
</script>

<style lang="scss">
html {
  /* font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif; */
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.el-container {
  min-height: 100vh;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
