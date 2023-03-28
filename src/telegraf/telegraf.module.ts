import { Module } from '@nestjs/common';
import { BotModule } from 'src/integration/bot/bot.module';
import { TelegrafService } from 'src/telegraf/telegraf.service';

@Module({
  imports: [BotModule],
  providers: [TelegrafService],
})
export class TelegrafModule {}
