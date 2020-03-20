<template>
  <div
    id="page-character"
    :hide-e-fire="!shouldShow('element', 1)"
    :hide-e-water="!shouldShow('element', 2)"
    :hide-e-thunder="!shouldShow('element', 3)"
    :hide-e-wind="!shouldShow('element', 4)"
    :hide-e-light="!shouldShow('element', 5)"
    :hide-e-dark="!shouldShow('element', 6)"
    :hide-r-1="!shouldShow('rarity', 1)"
    :hide-r-2="!shouldShow('rarity', 2)"
    :hide-r-3="!shouldShow('rarity', 3)"
    :hide-r-4="!shouldShow('rarity', 4)"
    :hide-r-5="!shouldShow('rarity', 5)"
    :hide-p-sword="!shouldShow('profession', 1)"
    :hide-p-archer="!shouldShow('profession', 2)"
    :hide-p-melee="!shouldShow('profession', 3)"
    :hide-p-special="!shouldShow('profession', 4)"
    :hide-p-assist="!shouldShow('profession', 5)"
  >
    <el-card>
      <wf-characters-filter
        :form="filter"
        :disabled="{
          element: true
        }"
      ></wf-characters-filter>
    </el-card>
    <el-card>
      <wf-characters-table :characters="characters"></wf-characters-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import table from '@/components/characters/wf-characters-table.vue';

import filter from '@/components/characters/wf-characters-filter.vue';
import { CharacterFilter } from '@/store/character';
import {
  Character,
  SerializeCharacterElement,
  CharacterElement
} from '@/server/schemas/character';

type VueData = {
  filter: CharacterFilter;
  characters: Array<Character>;
};

export default Vue.extend({
  components: {
    'wf-characters-table': table,
    'wf-characters-filter': filter
  },
  async asyncData(context): Promise<VueData> {
    // Reset Filter
    await context.app.$accessor.character.SET_FILTER();
    await context.app.$accessor.character.fetch();
    await context.app.$accessor.character.UPDATE_FILTER({
      element: [
        SerializeCharacterElement(context.params.element as CharacterElement)
      ]
    });
    return {
      filter: context.app.$accessor.character.filter,
      characters: context.app.$accessor.character.data
    };
  },
  data(): VueData {
    return {
      filter: {},
      characters: []
    };
  },
  mounted() {
    this.handleFilterChanged();
    this.$root.$on('filter-changed', this.handleFilterChanged);
  },
  beforeDestroy() {
    this.$root.$off('filter-changed', this.handleFilterChanged);
  },
  methods: {
    handleFilterChanged() {
      this.filter = Object.assign({}, this.$accessor.character.filter);
    },
    shouldShow(path: 'rarity' | 'profession' | 'element', index: number) {
      return !!this.filter[path]?.includes(index as never);
    }
  }
});
</script>

<style lang="scss" scoped>
@mixin hidden-table-row($attr, $selectors...) {
  &[#{$attr}] ::v-deep {
    @for $i from 0 to length($selectors) {
      .el-table__row.#{nth($selectors, $i + 1)} {
        display: none;
      }
    }
  }
}

#page-character {
  @include hidden-table-row('hide-e-fire', 'e1');
  @include hidden-table-row('hide-e-water', 'e2');
  @include hidden-table-row('hide-e-thunder', 'e3');
  @include hidden-table-row('hide-e-wind', 'e4');
  @include hidden-table-row('hide-e-light', 'e5');
  @include hidden-table-row('hide-e-dark', 'e6');

  @include hidden-table-row('hide-r-1', 'r1');
  @include hidden-table-row('hide-r-2', 'r2');
  @include hidden-table-row('hide-r-3', 'r3');
  @include hidden-table-row('hide-r-4', 'r4');
  @include hidden-table-row('hide-r-5', 'r5');

  @include hidden-table-row('hide-p-sword', 'p1');
  @include hidden-table-row('hide-p-archer', 'p2');
  @include hidden-table-row('hide-p-melee', 'p3');
  @include hidden-table-row('hide-p-special', 'p4');
  @include hidden-table-row('hide-p-assist', 'p5');

  .el-card:nth-child(n + 2) {
    margin-top: 16px;
  }
}
</style>
