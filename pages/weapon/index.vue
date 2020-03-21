<template>
  <div
    id="page-weapon"
    :hide-e-fire="!shouldShow('element', 1)"
    :hide-e-water="!shouldShow('element', 2)"
    :hide-e-thunder="!shouldShow('element', 3)"
    :hide-e-wind="!shouldShow('element', 4)"
    :hide-e-light="!shouldShow('element', 5)"
    :hide-e-dark="!shouldShow('element', 6)"
    :hide-e-all="!shouldShow('element', 7)"
    :hide-r-1="!shouldShow('rarity', 1)"
    :hide-r-2="!shouldShow('rarity', 2)"
    :hide-r-3="!shouldShow('rarity', 3)"
    :hide-r-4="!shouldShow('rarity', 4)"
    :hide-r-5="!shouldShow('rarity', 5)"
  >
    <el-card>
      <wf-weapons-filter :form="filter"></wf-weapons-filter>
    </el-card>
    <el-card>
      <wf-weapons-table :weapons="weapons"></wf-weapons-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import table from '@/components/weapons/wf-weapons-table.vue';
import filter from '@/components/weapons/wf-weapons-filter.vue';
import { Weapon } from '@/server/schemas/weapon';
import { WeaponFilter } from '@/store/weapon';

type VueData = {
  filter: WeaponFilter;
  weapons: Array<Weapon>;
};

export default Vue.extend({
  components: {
    'wf-weapons-table': table,
    'wf-weapons-filter': filter
  },
  async asyncData(context): Promise<VueData> {
    // Reset Filter
    await context.app.$accessor.weapon.SET_FILTER();
    await context.app.$accessor.weapon.fetch();
    await context.app.$accessor.weapon.UPDATE_FILTER({
      element: []
    });
    return {
      filter: context.app.$accessor.weapon.filter,
      weapons: context.app.$accessor.weapon.data
    };
  },
  data(): VueData {
    return {
      filter: {},
      weapons: []
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
      this.filter = Object.assign({}, this.$accessor.weapon.filter);
    },
    shouldShow(path: 'rarity' | 'element', index: number) {
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

#page-weapon {
  @include hidden-table-row('hide-e-fire', 'e1');
  @include hidden-table-row('hide-e-water', 'e2');
  @include hidden-table-row('hide-e-thunder', 'e3');
  @include hidden-table-row('hide-e-wind', 'e4');
  @include hidden-table-row('hide-e-light', 'e5');
  @include hidden-table-row('hide-e-dark', 'e6');
  @include hidden-table-row('hide-e-all', 'e7');

  .el-card:nth-child(n + 2) {
    margin-top: 16px;
  }
}
</style>
