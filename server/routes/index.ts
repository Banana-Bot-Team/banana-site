import { IncomingMessage } from 'http';
import KoaRouter from '@koa/router';
import Koa from 'koa';

import Character from './character';
import Weapon from './weapon';
import Checklist from './checklist';
import System from './system';

type NuxtKoaIncomingMessage = IncomingMessage & {
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>;
};

export const router = new KoaRouter();
router.prefix('/api/v1');

export default function (app: Koa, nuxt: any) {
  Character(router);
  Weapon(router);
  Checklist(router);
  System(router);

  // this line must be bottom
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use((ctx) => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    (<NuxtKoaIncomingMessage>ctx.req).ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });
}
