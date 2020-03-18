<template>
  <div class="wf-character-info">
    <el-card :class="`box-card e${character.element}`" :shadow="shadow">
      <el-row>
        <el-col :span="9">
          <el-image :src="character.images.fullShot"></el-image>
        </el-col>
        <el-col :span="15">
          <el-row>
            <div class="name">
              {{ character.name }}
            </div>
            <div class="cv">
              {{ `CV: ${character.cv}` }}
            </div>
          </el-row>
          <el-row>
            <el-col :span="3">
              <div class="badge">{{ $t('gender') }}</div>
            </el-col>
            <el-col :span="9">
              <div class="text">
                {{ character.gender }}
              </div>
            </el-col>
            <el-col :span="3">
              <div class="badge">{{ $t('profession') }}</div>
            </el-col>
            <el-col :span="9">
              <div class="text">
                {{ character.profession }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <div class="badge">{{ $t('star') }}</div>
            </el-col>
            <el-col :span="9">
              <div class="text">{{ character.rarity }}</div>
            </el-col>
            <el-col :span="3">
              <div class="badge">{{ $t('races') }}</div>
            </el-col>
            <el-col :span="9">
              <div class="text">
                {{ character.races.map((race) => race.trim()).join(' / ') }}
              </div>
            </el-col>
          </el-row>
          <el-row class="">
            <el-col :span="3">
              <div class="badge">{{ $t('hp') }}</div>
            </el-col>
            <el-col :span="9">
              <div class="text">{{ character.hp }}</div>
            </el-col>
            <el-col :span="3">
              <div class="badge">{{ $t('atk') }}</div>
            </el-col>
            <el-col :span="9">
              <div class="text">{{ character.atk }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">
              <div :class="`badge e${character.element}`">
                {{ $t('element') }}
              </div>
            </el-col>
            <el-col :span="9">
              <div :class="`text e${character.element}`">
                {{ character.element }}
              </div>
            </el-col>
          </el-row>

          <el-row class="next">
            <el-col :span="3">
              <div class="badge">
                {{ $t('leaderbuff') }}
              </div>
            </el-col>
            <el-col :span="9">
              <div class="text">{{ character.leaderbuff.name }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="text left">
                {{ character.leaderbuff.description }}
              </div>
            </el-col>
          </el-row>
          <el-row class="next">
            <el-col :span="3">
              <div class="badge">
                {{ $t('skill') }}
              </div>
            </el-col>
            <el-col :span="9">
              <div class="text">{{ character.skill.name }}</div>
            </el-col>
            <el-col :span="3">
              <div class="badge">
                {{ $t('cost') }}
              </div>
            </el-col>
            <el-col :span="9">
              <div class="text">{{ character.skill.cost }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div class="text left">{{ character.skill.description }}</div>
            </el-col>
          </el-row>
          <el-row
            v-for="(ability, index) in character.abilities"
            :key="`ability ${index}`"
            class="next"
          >
            <el-col :span="24">
              <div class="badge">{{ $tc('ability', index + 1) }}</div>
            </el-col>
            <el-col :span="24">
              <div class="text left">{{ ability.description }}</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    character: {
      type: Object,
      default: () => {}
    },
    shadow: {
      type: String,
      default: 'never'
    }
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

.box-card {
  border: initial;
  background-color: rgba(255, 255, 255, 0);

  .el-image {
    width: 100%;
  }

  .next {
    margin-top: 16px;
  }

  .name {
    padding-top: 18px;
    margin-bottom: 0px;
    font-size: 38px;
    line-height: 60px;
    font-weight: bold;
    color: #515d78;
    text-shadow: white 3px 0px 0px, white 2.83487px 0.98158px 0px,
      white 2.35766px 1.85511px 0px, white 1.62091px 2.52441px 0px,
      white 0.70571px 2.91581px 0px, white -0.28717px 2.98622px 0px,
      white -1.24844px 2.72789px 0px, white -2.07227px 2.16926px 0px,
      white -2.66798px 1.37182px 0px, white -2.96998px 0.42336px 0px,
      white -2.94502px -0.5717px 0px, white -2.59586px -1.50383px 0px,
      white -1.96093px -2.27041px 0px, white -1.11013px -2.78704px 0px,
      white -0.13712px -2.99686px 0px, white 0.85099px -2.87677px 0px,
      white 1.74541px -2.43999px 0px, white 2.44769px -1.73459px 0px,
      white 2.88051px -0.83825px 0px;
  }

  .cv {
    margin-bottom: 15px;
    font-size: 18px;
    line-height: 1.2em;
    color: #515d78;
    font-weight: bold;
    text-shadow: white 3px 0px 0px, white 2.83487px 0.98158px 0px,
      white 2.35766px 1.85511px 0px, white 1.62091px 2.52441px 0px,
      white 0.70571px 2.91581px 0px, white -0.28717px 2.98622px 0px,
      white -1.24844px 2.72789px 0px, white -2.07227px 2.16926px 0px,
      white -2.66798px 1.37182px 0px, white -2.96998px 0.42336px 0px,
      white -2.94502px -0.5717px 0px, white -2.59586px -1.50383px 0px,
      white -1.96093px -2.27041px 0px, white -1.11013px -2.78704px 0px,
      white -0.13712px -2.99686px 0px, white 0.85099px -2.87677px 0px,
      white 1.74541px -2.43999px 0px, white 2.44769px -1.73459px 0px,
      white 2.88051px -0.83825px 0px;
  }

  .badge {
    background-color: #515d78;
    border-radius: 15px;
    font-size: 12px;
    color: #fff;
    width: 62px;
    height: 19px;
    text-align: center;
    margin-bottom: 6px;
    padding-top: 1px;
    line-height: 18px;

    @include element-color('background-color', 1);
  }

  .text {
    font-size: 16px;
    line-height: 1em;
    color: #4b4b4b;
    margin-left: 8px;
    margin-bottom: 6px;
    text-align: center;

    &.left {
      text-align: left;
    }

    @include element-color('color', 1);
  }
}
</style>
