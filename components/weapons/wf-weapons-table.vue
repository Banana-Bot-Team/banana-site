<template>
  <div class="wf-weapons-table">
    <el-table
      :data="weapons"
      style="width: 100%;"
      :row-class-name="tableRowClassName"
    >
      <el-table-column
        :label="$t('thumbnail')"
        width="80"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100%;"
            :src="scope.row.images && scope.row.images.square"
            fit="contain"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('star')"
        width="80"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <wf-rarity :rarity="scope.row.rarity"></wf-rarity>
        </template>
      </el-table-column>
      <el-table-column :label="$t('name')" align="center" header-align="center">
        <template slot-scope="scope">
          <div class="col-name">
            <el-link :href="tableRowHref(scope)" :underline="false">
              <h3>{{ scope.row.name }}</h3>
            </el-link>
            <span>{{ scope.row.nickname }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import {
  DeserializeWeaponElement,
  Weapon,
  SerializeWeaponElement
} from '@/server/schemas/weapon';
import WFRarity from '@/components/icons/wf-rarity.vue';

export default Vue.extend({
  components: { 'wf-rarity': WFRarity },
  props: {
    weapons: {
      type: Array,
      default: () => []
    } as PropOptions<Array<Weapon>>
  },
  methods: {
    tableRowClassName(scoped: { row: Weapon; rowIndex: number }) {
      return `r${scoped.row.rarity} e${scoped.row.element}`;
    },
    tableRowHref(scoped: { row: Weapon; rowIndex: number }) {
      const element = DeserializeWeaponElement(
        SerializeWeaponElement(scoped.row.element)
      );
      return `/weapon/${element}/${scoped.row.name}`;
    }
  }
});
</script>

<style lang="scss" scoped>
@mixin table-row-style($r, $g, $b, $selectors...) {
  @for $i from 0 to length($selectors) {
    .el-table__row.#{nth($selectors, $i + 1)} {
      background-color: rgba($r, $g, $b, 0.3);

      &:hover td {
        background-color: rgba($r, $g, $b, 0.6);
      }
    }
  }
}

::v-deep .el-table {
  @include table-row-style(163, 37, 53, 'e1');
  @include table-row-style(47, 96, 178, 'e2');
  @include table-row-style(178, 150, 20, 'e3');
  @include table-row-style(83, 151, 34, 'e4');
  @include table-row-style(171, 178, 131, 'e5');
  @include table-row-style(63, 40, 67, 'e6');
  @include table-row-style(0, 0, 0, 'e7');
  @include table-row-style(128, 128, 128, 'e8');
}

.col-name {
  span {
    display: block;
    width: 100%;
    text-align: center;
  }
}
</style>
