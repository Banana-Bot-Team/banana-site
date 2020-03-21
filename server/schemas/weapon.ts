import * as Validator from '@climba03003/validator';

export type WeaponLanguage = 'en' | 'cn' | 'jp';

export type WeaponElement =
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
  | 'DARK'
  | '全'
  | 'ALL'
  | '無'
  | 'NONE';

export function SerializeWeaponElement(
  element: WeaponElement | number
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
    case 7:
    case '全':
    case 'ALL':
      return 7;
    case 8:
    case '無':
    case 'NONE':
      return 8;
    default:
      return 0;
  }
}

export function DeserializeWeaponElement(
  element: number,
  language: WeaponLanguage = 'jp'
): WeaponElement {
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
      if (language === 'en') return 'DARK';
      if (language === 'cn') return '暗';
      return '闇';
    case 7:
      if (language === 'en') return 'ALL';
      return '全';
    case 8:
    default:
      if (language === 'en') return 'NONE';
      return '無';
  }
}

export const WeaponElementArray: Array<WeaponElement> = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8
].map((e) => DeserializeWeaponElement(e));

export type WeaponRarity = 1 | 2 | 3 | 4 | 5;

export const WeaponRarityArray: Array<WeaponRarity> = [1, 2, 3, 4, 5];

export type WeaponMultiply = {
  soul: Array<number>;
  max: Array<number>;
};

export type WeaponImage = {
  square: string;
};

export class Weapon {
  #raw: Partial<Weapon>;

  uuid!: string;

  #element!: number;
  name!: string;
  rarity!: WeaponRarity;

  hp!: Array<number>;
  atk!: Array<number>;

  effect!: string;
  multiply!: WeaponMultiply;

  obtainFrom!: Array<string>;
  images!: WeaponImage;

  language!: WeaponLanguage;

  constructor(raw: Partial<Weapon>) {
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
      Validator.String.isString(this.#raw.name)
    ) {
      this.element = this.#raw.element;
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
    // HP
    if (
      Validator.Empty.isExist(this.#raw.hp) &&
      Validator.Array.isArray(this.#raw.hp)
    ) {
      this.hp = Array.from(this.#raw.hp);
    }
    // ATK
    if (
      Validator.Empty.isExist(this.#raw.atk) &&
      Validator.Array.isArray(this.#raw.atk)
    ) {
      this.atk = Array.from(this.#raw.atk);
    }
    // Effect
    if (
      Validator.Empty.isExist(this.#raw.effect) &&
      Validator.String.isString(this.#raw.effect)
    ) {
      this.effect = this.#raw.effect;
    }
    // Weapon Multiply
    if (
      Validator.Empty.isExist(this.#raw.multiply) &&
      Validator.JSON.isJSON(this.#raw.multiply)
    ) {
      // Prevent Object Reference
      this.multiply = Object.assign({}, this.#raw.multiply);
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
      element: this.#element
    });
  }

  get element() {
    return DeserializeWeaponElement(this.#element, this.language);
  }

  set element(element: WeaponElement | number) {
    this.#element = SerializeWeaponElement(element);
  }
}
