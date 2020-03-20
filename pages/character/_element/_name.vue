<template>
  <div class="container">
    <el-card :class="`e${character.element}`">
      <wf-character-info :character="character"></wf-character-info>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import info from '@/components/characters/wf-character-info.vue';
import {
  SerializeCharacterElement,
  CharacterElement
} from '@/server/schemas/character';
export default Vue.extend({
  components: {
    'wf-character-info': info
  },
  async asyncData(context) {
    // Reset Filter
    await context.app.$accessor.character.SET_FILTER(undefined);
    // Update Filter
    await context.app.$accessor.character.UPDATE_FILTER({
      element: [
        SerializeCharacterElement(context.params.element as CharacterElement)
      ],
      name: context.params.name
    });
    const data = await context.app.$accessor.character.fetch();
    return {
      character: data[0]
    };
  }
});
</script>

<style lang="scss" scoped>
@mixin element-color($property, $alpha) {
  &.e1 {
    #{$property}: rgba(163, 37, 53, $alpha);
  }

  &.e2 {
    #{$property}: rgba(47, 96, 178, $alpha);
  }

  &.e3 {
    #{$property}: rgba(178, 150, 20, $alpha);
  }

  &.e4 {
    #{$property}: rgba(83, 151, 34, $alpha);
  }

  &.e5 {
    #{$property}: rgba(171, 178, 131, $alpha);
  }

  &.e6 {
    #{$property}: rgba(63, 40, 67, $alpha);
  }
}
.container {
  width: 100%;
  height: 100%;
  min-height: 100vh;

  .el-card {
    @include element-color('background-color', 0.3);
  }
}
</style>
