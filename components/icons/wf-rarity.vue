<template>
  <div class="wf-rarity">
    <el-image style="width: 80px;" :src="url">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    rarity: {
      type: Number,
      default: 5
    }
  },
  computed: {
    url(): string {
      let rarity = this.rarity;
      if (
        isNaN(this.rarity) ||
        Number(this.rarity) < 1 ||
        Number(this.rarity) > 5
      ) {
        rarity = 1;
      }
      return `/interfaces/stars/character_${rarity}.png`;
    }
  }
});
</script>
