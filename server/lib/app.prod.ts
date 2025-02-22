import Koa from 'koa';
import serve from 'koa-static';
import { resolve } from 'path';
import { logger } from './utils';
import { Server } from 'http';
import { createIO } from './io';
import config from './config';


(async () => {
  const app = new Koa();

  app.use(serve(resolve(__dirname, '../../web/hotaru-theme/dist'), {
    maxage: 2592000
  }));

  const server = new Server(app.callback());

  await createIO(server);

  server.listen(config.port, () => logger.info(`🎉  NodeStatus is listening on http://localhost:${ config.port }`));
})();

