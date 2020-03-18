import { getterTree, mutationTree, actionTree } from 'typed-vuex';
import {
  Character,
  CharacterLanguage,
  CharacterRarity,
  CharacterElement,
  CharacterProfession,
  SerializeCharacterElement,
  SerializeCharacterProfession
} from '@/server/schemas/character';

export type CharacterFilter = Partial<{
  language: CharacterLanguage;
  rarity: Array<CharacterRarity>;
  profession: Array<number>;
  element: Array<number>;
  name: string;
}>;

export type CharacterSort = Partial<
  {
    [key in keyof Character]: -1 | 1;
  }
>;

const def = {
  data: <Array<Character>>[],
  filter: <CharacterFilter>{
    language: 'cn',
    element: ['火', '水', '雷', '風', '暗', '光'].map((s) =>
      SerializeCharacterElement(s as CharacterElement)
    ),
    profession: ['射撃', '剣士', '特殊', '格闘', '補助'].map((s) =>
      SerializeCharacterProfession(s as CharacterProfession)
    ),
    rarity: [1, 2, 3, 4, 5]
  },
  sort: <CharacterSort>{
    element: 1,
    rarity: -1
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
  SET_DATA(state, characters: Array<Character> = []) {
    state.data = Array.from(characters ?? []);
  },
  SET_FILTER(state, filter: CharacterFilter = def.filter) {
    state.filter = Object.assign({}, filter);
  },
  UPDATE_FILTER(state, filter: CharacterFilter = {}) {
    state.filter = Object.assign({}, state.filter, filter);
  }
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetch({ commit, state }, sort: CharacterSort = def.sort) {
      const filter = {
        language: state.filter.language,
        element: {
          $in: state.filter.element
        },
        profession: {
          $in: state.filter.profession
        },
        rarity: {
          $in: state.filter.rarity
        },
        name: state.filter.name
      };
      const { data } = await this.$axios.get('/characters', {
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
