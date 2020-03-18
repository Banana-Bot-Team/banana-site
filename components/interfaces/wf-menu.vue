<template>
  <div class="wf-menu">
    <el-menu :mode="mode">
      <el-submenu index="character">
        <template slot="title">
          <el-link :underline="false" href="/character">
            {{ $t('character') }}
          </el-link>
        </template>
        <el-menu-item
          v-for="element in elements.character"
          :key="'character-' + element"
          :index="'character-' + element"
        >
          <el-link
            :underline="false"
            :href="'/character/' + $t('element.' + element)"
          >
            {{ $t('element.' + element) }}
          </el-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="weapon">
        <template slot="title">
          <el-link :underline="false" href="/weapon">
            {{ $t('weapon') }}
          </el-link>
        </template>
        <el-menu-item
          v-for="element in elements.weapon"
          :key="'weapon-' + element"
          :index="'weapon-' + element"
        >
          <el-link
            :underline="false"
            :href="'/weapon/' + $t('element.' + element)"
          >
            {{ $t('element.' + element) }}
          </el-link>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="tools">
        <template slot="title">
          {{ $t('tools') }}
        </template>
        <el-menu-item>
          <el-link :underline="false" href="/tools/inventory">
            {{ $t('tools.inventory') }}
          </el-link>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    mode: {
      type: String,
      default: 'horizontal'
    }
  },
  data() {
    return {
      elements: {
        character: ['fire', 'water', 'thunder', 'wind', 'light', 'dark'],
        weapon: [
          'fire',
          'water',
          'thunder',
          'wind',
          'light',
          'dark',
          'all',
          'none'
        ]
      }
    };
  }
});
</script>

<style lang="scss" scoped>
.el-menu.el-menu--horizontal {
  border-bottom: none;

  .el-link {
    width: 100%;
  }
}

.el-menu.el-menu--popup {
  .el-link {
    width: 100%;
  }
}
</style>
