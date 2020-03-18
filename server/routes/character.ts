import KoaRouter from '@koa/router';
import Koa from 'koa';
import * as Validator from '@climba03003/validator';
import { Character as Controller } from '../controllers';
import { Character } from '../schemas/character';

export const router = new KoaRouter<Koa.DefaultState, Koa.DefaultContext>();
export default function (app: Koa | KoaRouter) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

router
  .prefix('/characters')
  .get('/', async function (ctx, _next) {
    let { filter = {}, options = {}, sort = {} } = ctx.query;

    // decode query from base64
    if (!Validator.Empty.isEmpty(filter)) {
      filter = JSON.parse(decodeURIComponent(atob(filter)));
    }

    // decode options from base64
    if (!Validator.Empty.isEmpty(options)) {
      options = JSON.parse(decodeURIComponent(atob(options)));
    }

    // decode options from base64
    if (!Validator.Empty.isEmpty(sort)) {
      sort = JSON.parse(decodeURIComponent(atob(sort)));
    }

    const cursor = await Controller.find(filter, options);
    ctx.status = 200;
    ctx.body = await cursor.sort(sort).toArray();
  })
  .post('/', async function (ctx, _next) {
    const data = new Character(ctx.request.body);
    const result = await Controller.insert(data.toJSON());
    ctx.body = result;
  })
  .get('/:id', async function (ctx, _next) {
    const result = await Controller.findOne({
      _id: ctx.params._id
    });
    ctx.body = result;
  });
