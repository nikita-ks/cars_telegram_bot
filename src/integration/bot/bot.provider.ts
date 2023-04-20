import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Scenes, Telegraf } from 'telegraf';

@Injectable()
export class BotProvider {
  bot: Telegraf<Scenes.SceneContext>;
  constructor(private config: ConfigService) {
    this.bot = new Telegraf<Scenes.SceneContext>(this.config.get('BOT_TOKEN'));
  }

  send(chatId: string, payload: string) {
    this.bot.telegram.sendMessage(chatId, payload);
  }
}
