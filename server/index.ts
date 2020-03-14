import consola from 'consola';
import dotenv from 'dotenv';
import { IncomingMessage } from 'http';
import Koa from 'koa';
import { Builder, Nuxt } from 'nuxt';

type NuxtKoaIncomingMessage = IncomingMessage & {
  ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>;
};

dotenv.config();

const app = new Koa();

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = app.env !== 'production';

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server;

  await nuxt.ready();
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use((ctx) => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    (<NuxtKoaIncomingMessage>ctx.req).ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });

  app.listen(port, host, async () => {
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    });
  });
}

start();
