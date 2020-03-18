import KoaRouter from '@koa/router';
import Koa from 'koa';
import {
  Checklist as ChecklistController,
  Character as CharacterController
} from '../controllers';
import { Checklist } from '../schemas/checklist';
import { Character } from '../schemas/character';

export const router = new KoaRouter<Koa.DefaultState, Koa.DefaultContext>();
export default function (app: Koa | KoaRouter) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

router
  .prefix('/checklists')
  .post('/', async function (ctx, _next) {
    const data = new Checklist(ctx.request.body);
    await ChecklistController.insertOne(data.toJSON());

    ctx.status = 200;
    ctx.body = data.toJSON();
  })
  .get('/:uuid', async function (ctx, _next) {
    const data = await ChecklistController.findOne({
      uuid: ctx.params.uuid
    });

    const checklist = new Checklist(data ?? {});

    // migration is required
    if (checklist.__v < Checklist.VERSION) {
      const cursor = await CharacterController.find({
        language: 'cn'
      });
      const characters = await cursor.toArray();

      checklist.migrate(characters.map((c) => new Character(c)));
    }

    ctx.status = 200;
    ctx.body = checklist.toJSON();
  })
  .put('/:uuid', async function (ctx, _next) {
    const data = new Checklist(ctx.request.body);
    await ChecklistController.updateOne(
      {
        uuid: ctx.params.uuid
      },
      data.toJSON()
    );
    ctx.status = 200;
    ctx.body = data.toJSON();
  });
