import { Module } from '@nestjs/common';
import { BotProvider } from 'src/integration/bot/bot.provider';

@Module({
  providers: [BotProvider],
  exports: [BotProvider],
})
export class BotModule {}
