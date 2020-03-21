import { getterTree, mutationTree, actionTree } from 'typed-vuex';
import {
  Weapon,
  WeaponElement,
  SerializeWeaponElement,
  WeaponElementArray,
  WeaponRarityArray,
  WeaponLanguage,
  WeaponRarity
} from '@/server/schemas/weapon';

export type WeaponFilter = Partial<{
  language: WeaponLanguage;
  rarity: Array<WeaponRarity>;
  element: Array<number>;
  name: string;
}>;

export type WeaponSort = Partial<
  {
    [key in keyof Weapon]: -1 | 1;
  }
>;

const def = {
  data: <Array<Weapon>>[],
  filter: <WeaponFilter>{
    language: 'jp',
    element: WeaponElementArray.map((s) =>
      SerializeWeaponElement(s as WeaponElement)
    ),
    rarity: WeaponRarityArray
  },
  sort: <WeaponSort>{
    rarity: -1,
    element: 1
  }
};

export const state = () => ({
  data: def.data,
  filter: def.filter,
  sort: def.sort
});

export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {
  SET_DATA(state, weapons: Array<Weapon> = []) {
    state.data = Array.from(weapons ?? []);
  },
  SET_FILTER(state, filter: WeaponFilter = def.filter) {
    state.filter = Object.assign({}, filter);
  },
  UPDATE_FILTER(state, filter: WeaponFilter = {}) {
    state.filter = Object.assign({}, state.filter, filter);
  }
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetch({ commit, state }, sort: WeaponSort = def.sort) {
      const filter = {
        language: state.filter.language,
        element: {
          $in: state.filter.element
        },
        rarity: {
          $in: state.filter.rarity
        },
        name: state.filter.name
      };
      const { data } = await this.$axios.get('/weapons', {
        params: {
          filter: btoa(encodeURIComponent(JSON.stringify(filter))),
          sort: btoa(encodeURIComponent(JSON.stringify(sort)))
        }
      });
      commit('SET_DATA', data);
      return Array.from(state.data);
    }
  }
);
