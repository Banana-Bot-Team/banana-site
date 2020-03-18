import KoaRouter from '@koa/router';
import Koa from 'koa';
import * as Crawler from '../utilities/crawler';
import {
  Character as CharacterController,
  Weapon as WeaponController
} from '../controllers';
import { SerializeCharacterElement } from '../schemas/character';
import { SerializeWeaponElement } from '../schemas/weapon';

export const router = new KoaRouter<Koa.DefaultState, Koa.DefaultContext>();
export default function (app: Koa | KoaRouter) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

router.prefix('/system').post('/init', async function (ctx, _next) {
  const characters = await Crawler.characters();

  await Promise.all(
    characters.map(async function (character) {
      const isDuplicate = await CharacterController.findOne({
        name: character.name,
        element: SerializeCharacterElement(character.element)
      });
      if (isDuplicate) {
        await CharacterController.updateOne(
          {
            name: character.name,
            element: SerializeCharacterElement(character.element),
            language: 'jp'
          },
          character.toJSON()
        );
      } else {
        await CharacterController.insertOne(character.toJSON());
      }
    })
  );

  const weapons = await Crawler.weapons();

  await Promise.all(
    weapons.map(async function (weapon) {
      const isDuplicate = await WeaponController.findOne({
        name: weapon.name,
        element: SerializeWeaponElement(weapon.element)
      });
      if (isDuplicate) {
        await WeaponController.updateOne(
          {
            name: weapon.name,
            element: SerializeWeaponElement(weapon.element),
            language: 'jp'
          },
          weapon.toJSON()
        );
      } else {
        await WeaponController.insertOne(weapon.toJSON());
      }
    })
  );

  ctx.body = {
    characters,
    weapons
  };
});
