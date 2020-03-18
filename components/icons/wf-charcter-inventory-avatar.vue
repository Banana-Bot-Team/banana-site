<template>
  <div
    class="wf-character-inventory-avatar"
    :checked="checked"
    @click="handleClick"
  >
    <el-avatar :size="size" :src="src" :shape="shape"></el-avatar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    shape: {
      type: String,
      default: 'square'
    },
    size: {
      type: Number,
      default: 64
    },
    src: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('change', !this.checked, this.name);
    }
  }
});
</script>

<style lang="scss" scoped>
.wf-character-inventory-avatar {
  display: inline-block;
  width: 70px;
  height: 70px;
  border: 3px solid rgba(255, 255, 255, 0);
  border-radius: 7px;
  opacity: 0.5;
  cursor: pointer;

  &[checked] {
    border: 3px solid #555;
    opacity: 1;
  }
}
</style>
