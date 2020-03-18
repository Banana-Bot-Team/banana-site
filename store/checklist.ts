import { getterTree, mutationTree, actionTree } from 'typed-vuex';
import { Character } from '@/server/schemas/character';
import { Checklist, ChecklistData } from '@/server/schemas/checklist';

export const state = () => ({
  data: <Checklist>{}
});

export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {
  SET_CHECKLIST(state, data: Checklist = new Checklist({})) {
    state.data = Object.assign({}, data);
  },
  SET_DATA(state, data: ChecklistData = {}) {
    state.data.data = Object.assign({}, data);
  },
  UPDATE_DATA(state, data: ChecklistData = {}) {
    state.data.data = Object.assign({}, state.data.data, data);
  },
  MIGRATE_DATA(state, characters: Array<Character> = []) {
    const checklist = new Checklist(state.data);
    checklist.migrate(characters);
    state.data = Object.assign({}, checklist);
  }
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchLocal({ commit, state }) {
      const data = JSON.parse(String(localStorage.getItem('banana_checklist')));
      const checklist = new Checklist(data);
      commit('SET_CHECKLIST', checklist);

      if (checklist.__v < Checklist.VERSION) {
        // Backward Capability
        const result = await this.$axios.get('/characters', {
          params: {
            filter: btoa(encodeURIComponent(JSON.stringify({ language: 'cn' })))
          }
        });
        commit('MIGRATE_DATA', result.data);
        // Backward Capability
      }

      return Object.assign({}, state.data);
    },
    async fetchRemote({ commit, state }, uuid: string) {
      const { data } = await this.$axios.get(`/checklists/${uuid}`);
      const checklist = new Checklist(data);
      commit('SET_CHECKLIST', checklist);

      if (checklist.__v < Checklist.VERSION) {
        // Backward Capability
        const result = await this.$axios.get('/characters', {
          params: {
            filter: btoa(encodeURIComponent(JSON.stringify({ language: 'cn' })))
          }
        });
        commit('MIGRATE_DATA', result.data);
        // Backward Capability
      }

      return Object.assign({}, state.data);
    },
    async saveLocal({ state }) {
      const checklist = new Checklist(state.data);
      localStorage.setItem(
        'banana_checklist',
        JSON.stringify(checklist.toJSON())
      );

      // save to remote
      const { data } = await this.$axios.get(`/checklists/${checklist.uuid}`);
      // same if remote data exist
      if (data.uuid === checklist.uuid) {
        await this.$axios.put(
          `/checklists/${checklist.uuid}`,
          checklist.toJSON()
        );
      } else {
        await this.$axios.post('/checklists', checklist.toJSON());
      }
    },
    async saveRemote({ state }, uuid: string) {
      const checklist = new Checklist(state.data);
      await this.$axios.put(`/checklists/${uuid}`, checklist.toJSON());
    },
    retrieve({ state }) {
      return Object.assign({}, state.data);
    },
    update({ commit }, { key, value }: { key: string; value: boolean }) {
      const data: ChecklistData = {};
      data[key] = value;
      commit('UPDATE_DATA', data);
    },
    async share({ state }) {
      const checklist = new Checklist(state.data);
      // check if remote data exist
      const { data } = await this.$axios.get(`/checklists/${checklist.uuid}`);
      // same if remote data exist
      if (data.uuid === checklist.uuid) {
        await this.$axios.put(
          `/checklists/${checklist.uuid}`,
          checklist.toJSON()
        );
      } else {
        await this.$axios.post('/checklists', checklist.toJSON());
      }
      return `/tools/inventory/${checklist.uuid}`;
    }
  }
);
