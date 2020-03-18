<template>
  <div id="inventory" :show-owned="owned">
    <el-card>
      <div id="control">
        <el-row class="margin">
          <span>Overall : </span>
          <span> {{ percentage() }} % </span>
          <span> ( {{ count() }} / {{ total() }} ) </span>
        </el-row>
        <el-row class="margin" :gutter="10">
          <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
            <el-button icon="el-icon-download" @click="handleSave">
              Save
            </el-button>
          </el-col>
          <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
            <el-button icon="el-icon-share" @click="handleShare">
              Share
            </el-button>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <el-switch
              v-model="owned"
              active-color="#ff4949"
              inactive-color="#13ce66"
              active-text="Show Owned"
              inactive-text="Show All"
            >
            </el-switch>
          </el-col>
          <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
            <el-button icon="el-icon-document-checked" @click="handleCheckAll">
              Check All
            </el-button>
          </el-col>
          <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
            <el-button icon="el-icon-document-delete" @click="handleUncheckAll">
              Uncheck All
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div
        v-for="n in [5, 4, 3, 2, 1]"
        :key="`rarity-${n}`"
        :class="`rarity-${n}`"
      >
        <el-row class="rarity-header">
          <el-col :xs="12" :sm="16" :md="20" :lg="20" :xl="20">
            <wf-rarity :rarity="n"></wf-rarity>
          </el-col>
          <el-col :xs="6" :sm="4" :md="2" :lg="2" :xl="2">
            <span> {{ percentage(n) }} %</span>
          </el-col>
          <el-col :xs="6" :sm="4" :md="2" :lg="2" :xl="2">
            <span>( {{ count(n) }} / {{ total(n) }} )</span>
          </el-col>
        </el-row>
        <wf-character-avatar-list
          :characters="slice(n)"
          :checklist="checklist.data"
          @change="handleChange"
        ></wf-character-avatar-list>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import WFRarity from '@/components/icons/wf-rarity.vue';
import WFCharacterAvatarList from '@/components/characters/wf-character-avatar-list.vue';
import { Character } from '@/server/schemas/character';
import { Checklist, ChecklistData } from '@/server/schemas/checklist';

type VueData = {
  characters: Array<Character>;
  checklist: Checklist;
  owned: boolean;
};

export default Vue.extend({
  components: {
    'wf-rarity': WFRarity,
    'wf-character-avatar-list': WFCharacterAvatarList
  },
  async asyncData(context): Promise<VueData> {
    // Reset Filter
    await context.app.$accessor.character.SET_FILTER(undefined);
    const characters = await context.app.$accessor.character.fetch({
      rarity: -1
    });
    return {
      characters,
      checklist: new Checklist({}),
      owned: false
    };
  },
  data(): VueData {
    return {
      characters: [],
      checklist: new Checklist({}),
      owned: false
    };
  },
  async mounted() {
    // put here because it can only be client-side
    this.checklist = await this.$accessor.checklist.fetchLocal();

    // Backward Capability
    if (this.$route.query.uuid) {
      this.$router.push({
        path: `${window.location.pathname}/${this.$route.query.uuid}`
      });
    }
    // Backward Capability
  },
  methods: {
    async handleChange(value: boolean, key: string) {
      await this.$accessor.checklist.update({ key, value });
      this.checklist = await this.$accessor.checklist.retrieve();
    },
    async handleSave() {
      await this.$accessor.checklist.saveLocal();
      this.$message.success('Data save successfully.');
    },
    async handleShare() {
      const textarea = document.createElement('textarea');
      document.body.append(textarea);
      const path = await this.$accessor.checklist.share();
      textarea.value = `${window.location.origin}${path}`;
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$message.success('URL copied to clipboard');
    },
    async handleCheckAll() {
      const all = this.characters.reduce(function (checklist, character) {
        checklist[
          `${character.rarity}_${character.element}_${character.jpname}`
        ] = true;
        return checklist;
      }, {} as ChecklistData);
      await this.$accessor.checklist.UPDATE_DATA(all);
      this.checklist = await this.$accessor.checklist.retrieve();
    },
    async handleUncheckAll() {
      await this.$accessor.checklist.SET_DATA(undefined);
      this.checklist = await this.$accessor.checklist.retrieve();
    },
    slice(rarity: number) {
      return this.characters
        .filter((c) => c.rarity === rarity)
        .sort((a, b) => Number(a.element) - Number(b.element));
    },
    count(rarity?: number) {
      let list = Object.entries(this.checklist.data)?.filter((o) => o[1]);
      if (rarity) {
        list = list.filter(([key]) => String(key).includes(String(rarity)));
      }
      return list.length;
    },
    total(rarity?: number) {
      let list = this.characters;
      if (rarity) {
        list = list.filter((c) => c.rarity === Number(rarity));
      }
      return list.length;
    },
    percentage(rarity?: number) {
      return parseInt(String((this.count(rarity) / this.total(rarity)) * 100));
    }
  }
});
</script>

<style lang="scss" scoped>
#inventory {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;

  .el-card {
    max-width: 1024px;
  }

  .margin {
    margin: 2px;

    .el-button,
    .el-switch {
      width: 100%;
      height: 42px;
    }
  }

  .rarity-header {
    height: 36px;

    span {
      text-align: right;
      width: 100%;
      display: inline-block;
    }
  }

  &::v-deep[show-owned] .wf-character-avatar-list .item {
    margin: 0px;

    .wf-character-inventory-avatar {
      margin: 2px;
      display: none;

      &[checked] {
        display: inline-block;
      }
    }
  }
}
</style>
