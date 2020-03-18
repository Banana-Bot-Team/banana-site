import { Connector, SessionStore } from '@climba03003/mongodb-utilities';
import consola from 'consola';
import dotenv from 'dotenv';
import Koa from 'koa';
import KoaBodyParser from 'koa-bodyparser';
import KoaHelmet from 'koa-helmet';
import KoaSession from 'koa-session';
import { Builder, Nuxt } from 'nuxt';
import Routes from './routes';
import './utilities/polyfills';

dotenv.config();

export const db = Connector.instance(process.env.MONGODB_URL);
db.databaseName = process.env.MONGODB_DB_NAME ?? 'banana';

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

  // Signing Key Set
  app.keys = [
    'xYfZrqDx2YqTUbMp',
    'tHAuQW29BqTQd4n2',
    '0sFnAm02yUIp4Vkj',
    'zvabAhN4ouTIdYAH',
    'j2CzgpW6TRZSguBa',
    'g0h960MiKLSBhQtu',
    '0RfuMy3AUDukiire',
    'LU8EIn7HtgyZVuuB',
    'UZ3W3IVR7tbOmoUQ',
    'rnBzXmrEn4djxbag'
  ];

  // Helmet Default Security Features
  app.use(KoaHelmet());

  // Parse Incoming Packet
  app.use(
    KoaBodyParser({
      formLimit: process.env.FORM_LIMIT || '1024mb',
      jsonLimit: process.env.JSON_LIMIT || '1024mb',
      textLimit: process.env.TEXT_LIMIT || '1024mb'
    })
  );

  // Create Session
  app.use(
    KoaSession(
      {
        key: 'PHPSESSID',
        store: new SessionStore(),
        maxAge: 86400000,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: false,
        renew: false
      },
      app
    )
  );

  Routes(app, nuxt);

  app.listen(port, host, async () => {
    try {
      consola.log('Start Database Connection');
      await db.connect();
      consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
      });
    } catch (err) {
      consola.error(err);
      process.exit(0);
    }
  });
}

start();
