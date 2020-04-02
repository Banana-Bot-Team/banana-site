import * as Validator from '@climba03003/validator';

export type CharacterLanguage = 'en' | 'cn' | 'jp';

export type CharacterElement =
  | '火'
  | 'FIRE'
  | '水'
  | 'WATER'
  | '雷'
  | 'THUNDER'
  | '風'
  | 'WIND'
  | '光'
  | 'LIGHT'
  | '闇'
  | '暗'
  | 'DARK';

export function SerializeCharacterElement(
  element: CharacterElement | number
): number {
  switch (element) {
    case 1:
    case '火':
    case 'FIRE':
      return 1;
    case 2:
    case '水':
    case 'WATER':
      return 2;
    case 3:
    case '雷':
    case 'THUNDER':
      return 3;
    case 4:
    case '風':
    case 'WIND':
      return 4;
    case 5:
    case '光':
    case 'LIGHT':
      return 5;
    case 6:
    case '暗':
    case '闇':
    case 'DARK':
      return 6;
    default:
      return 0;
  }
}

export function DeserializeCharacterElement(
  element: number,
  language: CharacterLanguage = 'jp'
): CharacterElement {
  switch (element) {
    case 1:
      if (language === 'en') return 'FIRE';
      return '火';
    case 2:
      if (language === 'en') return 'WATER';
      return '水';
    case 3:
      if (language === 'en') return 'THUNDER';
      return '雷';
    case 4:
      if (language === 'en') return 'WIND';
      return '風';
    case 5:
      if (language === 'en') return 'LIGHT';
      return '光';
    case 6:
    default:
      if (language === 'en') return 'DARK';
      if (language === 'cn') return '暗';
      return '闇';
  }
}

export const CharacterElementArray: Array<CharacterElement> = [
  1,
  2,
  3,
  4,
  5,
  6
].map((e) => DeserializeCharacterElement(e));

export type CharacterRarity = 1 | 2 | 3 | 4 | 5;

export const CharacterRarityArray: Array<CharacterRarity> = [1, 2, 3, 4, 5];

export type CharacterGender =
  | '女性'
  | 'Female'
  | '男性'
  | 'Male'
  | '不明'
  | 'Unknown';

export function SerializeCharacterGender(
  gender: CharacterGender | number
): number {
  switch (gender) {
    case 1:
    case '男性':
    case 'Male':
      return 1;
    case 2:
    case '女性':
    case 'Female':
      return 2;
    case 3:
    case '不明':
    case 'Unknown':
      return 3;
    default:
      return 0;
  }
}

export function DeserializeCharacterGender(
  gender: number,
  language: CharacterLanguage = 'jp'
): CharacterGender {
  switch (gender) {
    case 1:
      if (language === 'en') return 'Male';
      return '男性';
    case 2:
      if (language === 'en') return 'Female';
      return '女性';
    case 3:
    default:
      if (language === 'en') return 'Unknown';
      return '不明';
  }
}

export type CharacterProfession =
  | '剣士'
  | 'Sword'
  | '射撃'
  | 'Archer'
  | '格闘'
  | 'Melee'
  | '特殊'
  | 'Special'
  | '補助'
  | 'Assist';

export function SerializeCharacterProfession(
  profession: CharacterProfession | number
): number {
  switch (profession) {
    case 1:
    case 'Sword':
    case '剣士':
      return 1;
    case 2:
    case 'Archer':
    case '射撃':
      return 2;
    case 3:
    case 'Melee':
    case '格闘':
      return 3;
    case 4:
    case 'Special':
    case '特殊':
      return 4;
    case 5:
    case 'Assist':
    case '補助':
      return 5;
    default:
      return 0;
  }
}

export function DeserializeCharacterProfession(
  profession: number,
  language: CharacterLanguage = 'jp'
): CharacterProfession {
  switch (profession) {
    case 1:
      if (language === 'en') return 'Sword';
      return '剣士';
    case 2:
      if (language === 'en') return 'Archer';
      return '射撃';
    case 3:
      if (language === 'en') return 'Melee';
      return '格闘';
    case 4:
      if (language === 'en') return 'Special';
      return '特殊';
    case 5:
    default:
      if (language === 'en') return 'Assist';
      return '補助';
  }
}

export const CharacterProfessionArray: Array<CharacterProfession> = [
  '射撃',
  '剣士',
  '特殊',
  '格闘',
  '補助'
];

export type CharacterLeaderBuff = {
  name: string;
  description: string;
};

export type CharacterSkill = {
  name: string;
  description: string;
  cost: number;
};

export type CharacterAbility = {
  description: string;
};

export type CharacterImage = {
  square: string;
  fullShot: string;
  front: string;
  special: string;
};

export class Character {
  meta!: any;
  #raw: Partial<Character>;

  uuid!: string;

  #element!: number;
  jpname!: string;
  name!: string;
  rarity!: CharacterRarity;
  #gender!: number;
  races!: Array<string>;
  nickname!: string;
  #profession!: number;

  hp: number = -1;
  atk: number = -1;

  leaderbuff!: CharacterLeaderBuff;

  skill!: CharacterSkill;
  abilities: Array<CharacterAbility> = [];

  cv!: string;
  obtainFrom!: Array<string>;

  images!: CharacterImage;

  language!: CharacterLanguage;

  constructor(raw: Partial<Character>) {
    // Prevent Object Reference
    this.#raw = Object.assign({}, raw);

    // UUID
    if (
      Validator.Empty.isExist(this.#raw.uuid) &&
      Validator.String.isString(this.#raw.uuid)
    ) {
      this.uuid = this.#raw.uuid;
    }
    // Element
    if (
      Validator.Empty.isExist(this.#raw.element) &&
      (Validator.String.isString(this.#raw.element) ||
        Validator.Number.isNumber(this.#raw.element))
    ) {
      this.element = this.#raw.element;
    }
    // JP Name
    if (
      Validator.Empty.isExist(this.#raw.jpname) &&
      Validator.String.isString(this.#raw.jpname)
    ) {
      this.jpname = this.#raw.jpname;
    }
    // Name
    if (
      Validator.Empty.isExist(this.#raw.name) &&
      Validator.String.isString(this.#raw.name)
    ) {
      this.name = this.#raw.name;
    }
    // Rarity
    if (
      Validator.Empty.isExist(this.#raw.rarity) &&
      Validator.Number.isNumber(this.#raw.rarity) &&
      Validator.Number.isRange(this.#raw.rarity, 1, 5)
    ) {
      this.rarity = this.#raw.rarity;
    }
    // Gender
    if (
      Validator.Empty.isExist(this.#raw.gender) &&
      (Validator.String.isString(this.#raw.gender) ||
        Validator.Number.isNumber(this.#raw.gender))
    ) {
      this.gender = this.#raw.gender;
    }
    // Races
    if (
      Validator.Empty.isExist(this.#raw.races) &&
      Validator.Array.isArray(this.#raw.races)
    ) {
      // Prevent Object Reference
      this.races = Array.from(this.#raw.races);
    }
    // Nickname
    if (
      Validator.Empty.isExist(this.#raw.nickname) &&
      Validator.String.isString(this.#raw.nickname)
    ) {
      this.nickname = this.#raw.nickname;
    }
    // Profession
    if (
      Validator.Empty.isExist(this.#raw.profession) &&
      (Validator.String.isString(this.#raw.profession) ||
        Validator.Number.isNumber(this.#raw.profession))
    ) {
      this.profession = this.#raw.profession;
    }
    // HP
    if (
      Validator.Empty.isExist(this.#raw.hp) &&
      Validator.Number.isRange(this.#raw.hp, 0, 9999)
    ) {
      this.hp = this.#raw.hp;
    }
    // ATK
    if (
      Validator.Empty.isExist(this.#raw.atk) &&
      Validator.Number.isRange(this.#raw.atk, 0, 9999)
    ) {
      this.atk = this.#raw.atk;
    }
    // Leader Buff
    if (
      Validator.Empty.isExist(this.#raw.leaderbuff) &&
      Validator.JSON.isJSON(this.#raw.leaderbuff)
    ) {
      // Prevent Object Reference
      this.leaderbuff = Object.assign({}, this.#raw.leaderbuff);
    }
    // Skill
    if (
      Validator.Empty.isExist(this.#raw.skill) &&
      Validator.JSON.isJSON(this.#raw.skill)
    ) {
      // Prevent Object Reference
      this.skill = Object.assign({}, this.#raw.skill);
    }
    // Ability
    if (
      Validator.Empty.isExist(this.#raw.abilities) &&
      Validator.Array.isArray(this.#raw.abilities)
    ) {
      // Prevent Object Reference
      this.abilities = Array.from(this.#raw.abilities);
    }
    // CV
    if (
      Validator.Empty.isExist(this.#raw.cv) &&
      Validator.String.isString(this.#raw.cv)
    ) {
      this.cv = this.#raw.cv;
    }
    // Obtain From
    if (
      Validator.Empty.isExist(this.#raw.obtainFrom) &&
      Validator.Array.isArray(this.#raw.obtainFrom)
    ) {
      // Prevent Object Reference
      this.obtainFrom = Array.from(this.#raw.obtainFrom);
    }
    // Images
    if (
      Validator.Empty.isExist(this.#raw.images) &&
      Validator.JSON.isJSON(this.#raw.images)
    ) {
      // Prevent Object Reference
      this.images = Object.assign({}, this.#raw.images);
    }
    // Language
    if (
      Validator.Empty.isExist(this.#raw.language) &&
      Validator.String.isString(this.#raw.language)
    ) {
      this.language = this.#raw.language;
    }
  }

  toJSON() {
    return Object.assign({}, this, {
      element: this.#element,
      gender: this.#gender,
      profession: this.#profession
    });
  }

  get index() {
    return `${this.element}`;
  }

  get element() {
    return DeserializeCharacterElement(this.#element, this.language);
  }

  set element(element: CharacterElement | number) {
    this.#element = SerializeCharacterElement(element);
  }

  get gender() {
    return DeserializeCharacterGender(this.#gender, this.language);
  }

  set gender(gender: CharacterGender | number) {
    this.#gender = SerializeCharacterGender(gender);
  }

  get profession() {
    return DeserializeCharacterProfession(this.#profession, this.language);
  }

  set profession(profession: CharacterProfession | number) {
    this.#profession = SerializeCharacterProfession(profession);
  }
}
