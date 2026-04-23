import { createHonoServer } from 'react-router-hono-server/node';
import { app } from './app';

const server = await createHonoServer({
  app,
  defaultLogger: false,
});

export default server;
