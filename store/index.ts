import { getAccessorType } from 'typed-vuex';
import * as character from '@/store/character';
import * as checklist from '@/store/checklist';

export const accessorType = getAccessorType({
  modules: {
    // The key (submodule) needs to match the Nuxt namespace (e.g. ~/store/submodule.ts)
    character,
    checklist
  }
});
