import { defaultPort } from './constants';

export default () => ({
  port: parseInt(process.env.PORT, 10) || defaultPort,
  botToken: process.env.BOT_TOKEN ?? '',
  ...process.env,
});
