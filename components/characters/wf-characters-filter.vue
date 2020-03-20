<template>
  <div class="wf-characters-filter">
    <el-form label-width="120px" :label-position="'left'">
      <el-form-item label="星數">
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
      <el-form-item label="属性">
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
      <el-form-item label="種類">
        <el-checkbox-group
          v-model="form.profession"
          :disabled="disabled.profession"
          @change="handleProfessionChange"
        >
          <el-checkbox-button
            v-for="profession in professions"
            :key="$t(profession.label)"
            :label="profession.value"
          >
            {{ $t(profession.label) }}
          </el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import {
  CharacterElementArray,
  SerializeCharacterElement,
  DeserializeCharacterElement,
  CharacterProfessionArray,
  SerializeCharacterProfession,
  DeserializeCharacterProfession,
  CharacterRarityArray,
  CharacterRarity
} from '@/server/schemas/character';
import { CharacterFilter } from '@/store/character';
export default Vue.extend({
  props: {
    disabled: {
      type: Object,
      default() {
        return {
          rarity: false,
          element: false,
          profession: false
        };
      }
    } as PropOptions<
      {
        [key in keyof CharacterFilter]: boolean;
      }
    >,
    form: {
      type: Object,
      default() {
        return {
          rarity: [],
          element: [],
          profession: []
        };
      }
    } as PropOptions<CharacterFilter>
  },
  data() {
    return {
      elements: CharacterElementArray.map(function (s) {
        const value = SerializeCharacterElement(s);
        return {
          value,
          label: `element.${DeserializeCharacterElement(
            value,
            'en'
          ).toLowerCase()}`
        };
      }),
      professions: CharacterProfessionArray.map(function (s) {
        const value = SerializeCharacterProfession(s);
        return {
          value,
          label: `profession.${DeserializeCharacterProfession(
            value,
            'en'
          ).toLowerCase()}`
        };
      }),
      rarities: CharacterRarityArray
    };
  },
  methods: {
    handleElementChange(value: Array<number>) {
      this.$accessor.character.UPDATE_FILTER({
        element: value
      });
      this.$root.$emit('filter-changed');
    },
    handleProfessionChange(value: Array<number>) {
      this.$accessor.character.UPDATE_FILTER({
        profession: value
      });
      this.$root.$emit('filter-changed');
    },
    handleRarityChange(value: Array<CharacterRarity>) {
      this.$accessor.character.UPDATE_FILTER({
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
