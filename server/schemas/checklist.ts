import * as Validator from '@climba03003/validator';
import * as uuid from 'uuid';
import {
  Character,
  CharacterElement,
  SerializeCharacterElement
} from './character';

export type ChecklistData = {
  [key: string]: boolean;
};

export class Checklist {
  static VERSION: number = 1;
  #raw: Partial<Checklist>;
  uuid!: string;
  data!: ChecklistData;
  __v: number = Checklist.VERSION;

  constructor(raw: Partial<Checklist>) {
    this.#raw = Object.assign({}, raw);

    // if version is not found
    // it is an old record
    if (Validator.Empty.isEmpty(this.#raw.__v)) {
      // Prevent Object Reference
      this.data = Object.assign({}, this.#raw as ChecklistData);
      // no version
      this.__v = 0;
    }

    // UUID
    if (
      Validator.Empty.isExist(this.#raw.uuid) &&
      Validator.String.isString(this.#raw.uuid)
    ) {
      this.uuid = this.#raw.uuid;
    } else {
      this.uuid = uuid.v4();
    }
    // Data
    if (
      Validator.Empty.isExist(this.#raw.data) &&
      Validator.JSON.isJSON(this.#raw.data)
    ) {
      // Prevent Object Reference
      this.data = Object.assign({}, this.#raw.data);
    }
  }

  migrate(characters: Array<Character> = []) {
    // Backward Capability
    const keys = Object.keys(this.data);
    const data = keys.reduce((o, key) => {
      const [rarity, element, name] = key.split('_');
      const index = characters.findIndex(function (c) {
        return c.name === name;
      });
      o[
        `${rarity}_${SerializeCharacterElement(element as CharacterElement)}_${
          characters[index].jpname
        }`
      ] = this.data[key];
      return o;
    }, {} as ChecklistData);
    this.data = data;
    // Backward Capability
  }

  toJSON() {
    return Object.assign({}, this);
  }
}
