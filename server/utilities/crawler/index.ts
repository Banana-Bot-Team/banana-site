import { Character, SerializeCharacterElement } from '../../schemas/character';
import { Weapon } from '../../schemas/weapon';
import * as Spreadsheet from './spreadsheet';
import * as Gamewith from './gamewith';
import * as Offical from './official';

export async function characters(): Promise<Array<Character>> {
  const [cn, jp, images] = await Promise.all([
    Spreadsheet.character.fetch(),
    Gamewith.character.fetch(),
    Offical.character.images(3)
  ]);

  images.map(function (i) {
    let index = cn.findIndex(function (c) {
      return (
        i.name === c.jpname &&
        SerializeCharacterElement(i.element) ===
          SerializeCharacterElement(c.element)
      );
    });

    if (index !== -1) {
      cn[index].images = {
        square: i.square,
        fullShot: i.fullShot,
        front: i.front,
        special: i.special
      };
    }

    index = jp.findIndex(function (c) {
      return (
        i.name === c.jpname &&
        SerializeCharacterElement(i.element) ===
          SerializeCharacterElement(c.element)
      );
    });

    if (index !== -1) {
      jp[index].images = {
        square: i.square,
        fullShot: i.fullShot,
        front: i.front,
        special: i.special
      };
    }

    return i;
  });

  // Nicknames
  cn.map(function (c) {
    const index = jp.findIndex(function (j) {
      return (
        j.jpname === c.jpname &&
        SerializeCharacterElement(j.element) ===
          SerializeCharacterElement(c.element)
      );
    });

    if (index !== -1) {
      jp[index].nickname = c.nickname;
    }
  });

  return (<Array<Character>>[]).concat(cn).concat(jp);
}

export async function weapons(): Promise<Array<Weapon>> {
  const jp = await Gamewith.weapon.fetch();

  return jp;
}
