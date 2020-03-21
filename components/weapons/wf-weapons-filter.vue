<template>
  <div class="wf-weapons-filter">
    <el-form label-width="120px" :label-position="'left'">
      <el-form-item :label="$t('star')">
        <div class="rarity">
          <el-checkbox-group
            v-model="form.rarity"
            :disabled="disabled.rarity"
            @change="handleRarityChange"
          >
            <el-checkbox-button
              v-for="rarity in rarities"
              :key="rarity"
              :label="rarity"
            >
              {{ rarity }}
            </el-checkbox-button>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item :label="$t('element')">
        <el-checkbox-group
          v-model="form.element"
          :disabled="disabled.element"
          @change="handleElementChange"
        >
          <el-checkbox-button
            v-for="element in elements"
            :key="$t(element.label)"
            :label="element.value"
          >
            {{ $t(element.label) }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import {
  WeaponRarityArray,
  WeaponElementArray,
  SerializeWeaponElement,
  DeserializeWeaponElement,
  WeaponRarity
} from '@/server/schemas/weapon';
import { WeaponFilter } from '@/store/weapon';

export default Vue.extend({
  props: {
    disabled: {
      type: Object,
      default() {
        return {
          rarity: false,
          element: false
        };
      }
    } as PropOptions<
      {
        [key in keyof WeaponFilter]: boolean;
      }
    >,
    form: {
      type: Object,
      default() {
        return {
          rarity: [],
          element: []
        };
      }
    } as PropOptions<WeaponFilter>
  },
  data() {
    return {
      elements: WeaponElementArray.map(function (s) {
        const value = SerializeWeaponElement(s);
        return {
          value,
          label: `element.${DeserializeWeaponElement(
            value,
            'en'
          ).toLowerCase()}`
        };
      }),
      rarities: WeaponRarityArray
    };
  },
  methods: {
    handleElementChange(value: Array<number>) {
      this.$accessor.weapon.UPDATE_FILTER({
        element: value
      });
      this.$root.$emit('filter-changed');
    },
    handleRarityChange(value: Array<WeaponRarity>) {
      this.$accessor.weapon.UPDATE_FILTER({
        rarity: value
      });
      this.$root.$emit('filter-changed');
    }
  }
});
</script>

<style lang="scss" scoped>
.wf-character-filter {
  height: 240px;
  margin: 16px 24px;

  .rarity {
    width: 100%;
    position: relative;
  }
}
</style>
