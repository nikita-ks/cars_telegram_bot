import { Module } from '@nestjs/common';
import { BotModule } from '../integration/bot/bot.module';
import { ParserService } from '../parser/parser.service';
import { TelegrafService } from '../telegraf/telegraf.service';
import { VinCollectScene } from '../telegraf/vinCollect.scene';
import { VinResponseScene } from '../telegraf/vinResponse.scene';

@Module({
  imports: [BotModule],
  providers: [TelegrafService, VinCollectScene, VinResponseScene, ParserService],
})
export class TelegrafModule {}
