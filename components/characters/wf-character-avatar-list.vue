<template>
  <div class="wf-character-avatar-list">
    <div
      v-for="character in characters"
      :key="computeIndex(character)"
      class="item"
    >
      <wf-charcter-inventory-avater
        :src="character.images && character.images.square"
        :name="computeIndex(character)"
        :checked="checklist[computeIndex(character)]"
        v-on="$listeners"
      ></wf-charcter-inventory-avater>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { ChecklistData } from '@/server/schemas/checklist';
import WFCharacterInventoryAvater from '@/components/icons/wf-charcter-inventory-avatar.vue';
import { Character } from '@/server/schemas/character';
export default Vue.extend({
  components: {
    'wf-charcter-inventory-avater': WFCharacterInventoryAvater
  },
  props: {
    characters: {
      type: Array,
      default() {
        return [];
      }
    } as PropOptions<Array<Character>>,
    checklist: {
      type: Object,
      default() {
        return {};
      }
    } as PropOptions<ChecklistData>
  },
  methods: {
    computeIndex(character: Character) {
      return `${character.rarity}_${character.element}_${character.jpname}`;
    }
  }
});
</script>

<style lang="scss" scoped>
.item {
  display: inline-block;
  margin: 2px;
}
</style>
