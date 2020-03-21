import axios from 'axios';
import { JSDOM } from 'jsdom';
import {
  Character,
  CharacterRarity,
  CharacterProfession,
  CharacterElement,
  CharacterGender
} from '../../schemas/character';
import {
  Weapon,
  WeaponElement,
  WeaponMultiply,
  WeaponRarity
} from '../../schemas/weapon';

const fallback = {
  character: [
    'https://gamewith.jp/worldflipper/article/show/180045',
    'https://gamewith.jp/worldflipper/article/show/180044',
    'https://gamewith.jp/worldflipper/article/show/180043',
    'https://gamewith.jp/worldflipper/article/show/180042',
    'https://gamewith.jp/worldflipper/article/show/180041'
  ],
  weapon: 'https://gamewith.jp/worldflipper/article/show/178049'
};

async function fetchCharacterList(
  url: Array<string> = fallback.character
): Promise<Array<string>> {
  const data = await Promise.all(
    url.map(async function (url) {
      const { data: html } = await axios.get(url);

      const { window } = new JSDOM(html);
      const document = window.document;

      const doms = Array.from(
        document.querySelectorAll('.world_fp_charalist tr a')
      );

      return doms.map(function (dom: Element) {
        return String(dom.getAttribute('href'));
      });
    })
  );

  return data.reduce(function (urls, url) {
    return urls.concat(url);
  }, []);
}

async function fetchCharacter(
  url: Array<string> = fallback.character
): Promise<Array<Character>> {
  const list = await fetchCharacterList(url);

  return Promise.all(
    list.map(async function (url) {
      const { data: html } = await axios.get(url);

      const { window } = new JSDOM(html);
      const document = window.document;

      const p = new CharacterParser(document);

      return p.character;
    })
  );
}

export const character = {
  list: fetchCharacterList,
  fetch: fetchCharacter
};

type WeaponList = {
  [key: number]: Array<string>;
};

async function fetchWeaponList(
  url: string = fallback.weapon
): Promise<WeaponList> {
  const { data: html } = await axios.get(url);

  const { window } = new JSDOM(html);
  const document = window.document;

  const tables = Array.from(document.querySelectorAll('.world_fp_weapons'));

  return tables.reduce(function (list, table, index) {
    const doms = Array.from(table.querySelectorAll('tr a'));
    const urls = doms.map(function (dom: Element) {
      return String(dom.getAttribute('href'));
    });
    list[(index - 5) * -1] = urls;
    return list;
  }, <WeaponList>{});
}

async function fetchWeapon(
  url: string = fallback.weapon
): Promise<Array<Weapon>> {
  const list = await fetchWeaponList(url);
  let result: Array<Weapon> = [];

  for (let i = 5; i > 0; i--) {
    const urls = list[i];
    const weapons = await Promise.all(
      urls.map(async function (url) {
        const { data: html } = await axios.get(url);

        const { window } = new JSDOM(html);
        const document = window.document;

        const p = new WeaponParser(document);

        p.weapon.rarity = i as WeaponRarity;

        return p.weapon;
      })
    );

    result = result.concat(weapons);
  }

  return result;
}

export const weapon = {
  list: fetchWeaponList,
  fetch: fetchWeapon
};

abstract class BaseParser {
  protected dom!: Element | Document;
  protected tables!: Array<HTMLTableElement>;

  constructor(dom: Element | Document) {
    this.dom = dom;
    const body = this.dom.querySelector('#article-body');
    this.tables = Array.from(body?.querySelectorAll('table') ?? []);
  }

  protected findTableRow(
    keyword: string,
    vertical = false,
    position = 1,
    serialize = true
  ): string {
    const rows = this.tables.reduce(function (rows, table) {
      return rows.concat(Array.from(table.querySelectorAll('tr') ?? []));
    }, [] as Array<HTMLTableRowElement>);

    const index = rows.findIndex(function (row) {
      const columns = Array.from(row.querySelectorAll('th, td') ?? []);
      return columns
        .map(function (column) {
          return column.innerHTML ?? '';
        })
        .includes(keyword);
    });

    const row = rows[vertical ? index + position : index];

    const columns = Array.from(row.querySelectorAll('th, td') ?? []);

    if (!serialize) return columns[vertical ? 0 : position].innerHTML;
    return this.serializeHTML(columns[vertical ? 0 : position].innerHTML);
  }

  serializeHTML(s?: string): string {
    return String(s).replace(/<.*?>/g, ',').replace(/&amp;/g, '&').trim();
  }
}

class CharacterParser extends BaseParser {
  character = new Character({
    language: 'jp'
  });

  constructor(dom: Element | Document) {
    super(dom);
    this.parse();
    this.fix();
  }

  private parse(): void {
    const body = this.dom.querySelector('#article-body');

    const h2 = body?.querySelector('h2');

    const name = String(h2?.innerHTML).split('の');
    this.character.name = name.reduce(function (n, p, i) {
      if (i !== 0 && i < name.length - 1) return `${n}の${p}`;
      return n;
    }, name[0]);
    this.character.jpname = this.character.name?.replace(/\(.*\)/g, '');

    const rarity = this.findTableRow('レア度', undefined, undefined, false);
    this.character.rarity = Number(
      rarity?.match(/alt=["']★(\d+)["']/g)?.[0]?.match(/\d+/g)?.[0]
    ) as CharacterRarity;
    this.character.profession = this.findTableRow(
      'タイプ',
      false,
      3
    ) as CharacterProfession;

    this.character.element = this.findTableRow('属性') as CharacterElement;
    this.character.races = this.findTableRow('種族', false, 3).split('/');

    this.character.hp = Number(this.findTableRow('HP'));
    if (isNaN(this.character.hp)) this.character.hp = -1;
    this.character.atk = Number(this.findTableRow('攻撃'));
    if (isNaN(this.character.atk)) this.character.atk = -1;

    const leaderbuff = this.findTableRow('リーダー特性', true).split(',');
    this.character.leaderbuff = {
      name: leaderbuff[0].replace(/[【】]/g, '') ?? '-',
      description: leaderbuff[1] ?? '-'
    };

    const skill = this.findTableRow('スキル', true).split(',');
    this.character.skill = {
      name: skill[0].replace(/[【】]/g, '') ?? '-',
      description: skill[2],
      cost: Number(skill?.[1]?.match(/\d+/g)?.[0])
    };

    this.character.abilities = [];
    const abi1 = this.findTableRow('アビ1').split(',');
    this.character.abilities.push({
      description: abi1[1]
    });
    const abi2 = this.findTableRow('アビ2').split(',');
    this.character.abilities.push({
      description: abi2[1]
    });
    const abi3 = this.findTableRow('アビ3').split(',');
    if (!abi3?.[1]?.includes('なし'))
      this.character.abilities.push({
        description: abi3[1]
      });

    this.character.cv = this.findTableRow('声優');
    this.character.gender = this.findTableRow('性別') as CharacterGender;
  }

  // Fix some error
  private fix(): void {
    // Name fix
    if (this.character.name === 'C・F・キセキ') {
      this.character.name = 'Ｃ・Ｆ・キセキ';
      this.character.jpname = 'Ｃ・Ｆ・キセキ';
    }
    if (this.character.name === 'シャスス') {
      this.character.name = 'シャ・スス';
      this.character.jpname = 'シャ・スス';
    }
  }
}

class WeaponParser extends BaseParser {
  weapon = new Weapon({
    language: 'jp'
  });

  constructor(dom: Element | Document) {
    super(dom);
    this.parse();
    this.fix();
  }

  private parse(): void {
    const body = this.dom.querySelector('#article-body');

    const h2 = body?.querySelector('h2');
    const img = Array.from(body?.querySelectorAll('img') ?? []);

    const name = String(h2?.innerHTML).split('の');
    this.weapon.name = name.reduce(function (n, p, i) {
      if (i !== 0 && i < name.length - 1) return `${n}の${p}`;
      return n;
    }, name[0]);

    this.weapon.images = {
      square:
        img?.find((img) =>
          img?.src?.startsWith(
            'https://s3.ap-northeast-1.amazonaws.com/gamewith'
          )
        )?.src ?? ''
    };

    this.weapon.element = this.findTableRow('属性') as WeaponElement;
    // in-consistant keyword
    try {
      this.weapon.obtainFrom = this.findTableRow('入手方法').split(',');
    } catch {
      this.weapon.obtainFrom = this.findTableRow('主な入手方法').split(',');
    }

    this.weapon.hp = [
      Number(this.findTableRow('HP')),
      Number(this.findTableRow('HP', false, 2))
    ];
    if (isNaN(this.weapon.hp[0])) {
      this.weapon.hp[0] = this.weapon.hp[1];
    }

    this.weapon.atk = [
      Number(this.findTableRow('攻撃')),
      Number(this.findTableRow('攻撃', false, 2))
    ];
    if (isNaN(this.weapon.atk[0])) {
      this.weapon.atk[0] = this.weapon.atk[1];
    }

    this.weapon.effect = this.findTableRow('初期効果', true);

    // fallback
    if (this.weapon.effect === '-')
      this.weapon.effect = this.findTableRow('最大効果', true);

    this.weapon.multiply = this.computeMultiply();
  }

  // Fix some error
  private fix(): void {
    // Element fix
    if (this.weapon.name === '無銘の弓') {
      this.weapon.element = '全';
    }
  }

  computeMultiply(): WeaponMultiply {
    const init = this.findTableRow('初期効果', true);
    const initNumber = init.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    const max = this.findTableRow('最大効果', true);
    const maxNumber = max.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
    // if no init effect, it cannot be install in soul and the effect is max already
    if (init === '-') {
      return {
        soul: maxNumber.map(() => -1),
        max: maxNumber.map(() => 1)
      };
    }

    return {
      soul: initNumber.map((x, i) => maxNumber[i] / x),
      max: initNumber.map((x, i) => maxNumber[i] / x)
    };
  }
}
