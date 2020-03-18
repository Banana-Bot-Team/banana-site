import axios from 'axios';
import { JSDOM } from 'jsdom';
import {
  Character,
  CharacterRarity,
  CharacterProfession,
  CharacterElement,
  CharacterGender
} from '../../schemas/character';

const fallback =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS5OvhecdUnTXEeO2fpdERfiZh3PzadSoGcpQ1IEhAPCSfcv2iLk7p0V7MFiZ7AZNnPVRSzUsRI5Wye/pubhtml#';

async function fetchCharacter(
  url: string = fallback
): Promise<Array<Character>> {
  const { data: html } = await axios.get(url);
  const { window } = new JSDOM(html);
  const document = window.document;

  const tables = Array.from(
    document.querySelectorAll('#sheets-viewport > div')
  );

  let data: Array<Character> = [];

  tables.map(function (table, tableIndex) {
    // Index start with 0
    if (tableIndex > 5) return;

    const lines = Array.from(
      table.querySelectorAll('.grid-container tbody tr')
    );

    data = lines.reduce(function (arr, dom, index) {
      if (CharacterParser.shouldParse(dom)) {
        const p = new CharacterParser(
          lines.slice(index, index + 11),
          tableIndex
        );
        arr.push(p.character);
      }
      return arr;
    }, data);
  });

  return data.map(function (character) {
    character.rarity =
      CharacterParser.RarityMapper[String(character.meta?.star)];
    character.profession =
      CharacterParser.WeaponMapper[String(character.meta?.profession)];

    delete character.meta;

    return character;
  });
}

export const character = {
  fetch: fetchCharacter
};

type SerializedElement = {
  columns: HTMLTableDataCellElement[];
  images: HTMLImageElement[];
};

class CharacterParser {
  static JPAttributeList: Array<CharacterElement> = [
    '火',
    '水',
    '雷',
    '風',
    '闇',
    '光'
  ];

  static CNAttributeList: Array<CharacterElement> = [
    '火',
    '水',
    '雷',
    '風',
    '暗',
    '光'
  ];

  static ENAttributeList: Array<CharacterElement> = [
    'FIRE',
    'WATER',
    'THUNDER',
    'WIND',
    'DARK',
    'LIGHT'
  ];

  static RarityMapper: {
    [key: string]: CharacterRarity;
  } = {};

  static WeaponMapper: {
    [key: string]: CharacterProfession;
  } = {};

  private doms: Array<SerializedElement>;
  character: Character;

  constructor(doms: Array<Element>, index: number) {
    this.doms = doms.map((dom) => this.serialize(dom));
    this.character = new Character({
      element: CharacterParser.CNAttributeList[index],
      language: 'cn'
    });
    this.parse();
    this.updateMapper('ヴァーグナー', 5, '射撃');
    this.updateMapper('アルク', 4, '剣士');
    this.updateMapper('リリル', 3, '特殊');
    this.updateMapper('ゴーレム', 2, '格闘');
    this.updateMapper('ファイアスピリ', 1, '補助');
  }

  private parse(): void {
    // Line 1
    this.character.cv = this.findText(1, 'CV');
    this.character.obtainFrom = [this.findText(1, '取得方式')];

    // Line 2
    const names = this.findText(2, 'HP', -1, false).split('<br>');
    this.character.jpname = this.serializeHTML(names[0]);
    this.character.name = this.serializeHTML(names[1]);
    this.character.hp = Number(this.findText(2, 'HP'));

    // Line 3
    this.character.atk = Number(this.findText(3, 'ATK'));

    // Line 4
    this.character.nickname = this.findText(4, '別稱');
    this.character.races = this.findText(4, '種族')
      .split('/')
      .map((text) => this.serializeHTML(text));

    // Line 5

    this.character.gender = this.findText(5, '性別') as CharacterGender;

    // Line 6
    this.character.leaderbuff = {
      name: this.findText(6, '隊長特性'),
      description: this.findText(6, '隊長特性', 2)
    };

    // Line 7
    const nameField = this.findText(7, '技能');
    this.character.skill = {
      name: this.serializeHTML(nameField.split('<br>')[0]),
      description: this.findText(7, '技能', 2),
      cost: Number(Array.from(nameField.match(/\d+/g) || [])?.[0] ?? -1)
    };

    this.character.abilities = Array.from(this.character.abilities ?? []);
    // Line 8
    this.character.abilities.push({
      description: this.findText(8, '能力 1')
    });

    // Line 9
    this.character.abilities.push({
      description: this.findText(9, '能力 2')
    });

    // Line 10
    this.character.abilities.push({
      description: this.findText(10, '能力 3')
    });

    this.character.meta = {
      star: this.findImage(1, 0),
      profession: this.findImage(5, 0)
    };
  }

  updateMapper(
    name: string,
    rarity: 1 | 2 | 3 | 4 | 5,
    profession: CharacterProfession
  ): void {
    if (this.character.jpname === name) {
      CharacterParser.RarityMapper[this.findImage(1, 0)] = rarity;
      CharacterParser.WeaponMapper[this.findImage(5, 0)] = profession;
    }
  }

  indicator(doms: Array<Element>, word: string): number {
    return doms.findIndex(function (dom) {
      return dom.innerHTML === word;
    });
  }

  static indicator(doms: Array<Element>, word: string): number {
    return doms.findIndex(function (dom) {
      return dom.innerHTML === word;
    });
  }

  findText(line: number, word: string, offset = 1, serialize = true): string {
    const columns = this.doms[line - 1].columns;
    const index = this.indicator(columns, word);
    const html = String(columns?.[index + offset]?.innerHTML);
    return serialize ? this.serializeHTML(html) : html;
  }

  findImage(line: number, offset: number): string {
    const images = this.doms[line - 1].images;
    return images?.[offset]?.src;
  }

  serializeHTML(s?: string): string {
    return String(s).replace(/<.*?>/g, '').replace(/&amp;/g, '&').trim();
  }

  serialize(dom: Element): SerializedElement {
    const columns = Array.from(dom.querySelectorAll('td'));
    const images = Array.from(dom.querySelectorAll('img'));
    return {
      columns,
      images
    };
  }

  static serialize(dom: Element): SerializedElement {
    const columns = Array.from(dom.querySelectorAll('td'));
    const images = Array.from(dom.querySelectorAll('img'));
    return {
      columns,
      images
    };
  }

  static shouldParse(dom: Element): boolean {
    const { columns, images } = CharacterParser.serialize(dom);
    return !!columns.find((dom) => dom.innerHTML === '名稱') && !!images[0];
  }
}
