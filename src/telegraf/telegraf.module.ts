import { Module } from '@nestjs/common';
import { ParserModule } from 'src/parser/parser.module';
import { BotModule } from '../integration/bot/bot.module';
import { TelegrafService } from '../telegraf/telegraf.service';

@Module({
  imports: [BotModule, ParserModule],
  providers: [TelegrafService],
})
export class TelegrafModule {}
