import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class BotProvider {
  bot: Telegraf;
  constructor(private config: ConfigService) {
    this.bot = new Telegraf(this.config.get('BOT_TOKEN'));
  }

  send(chatId: string, payload: string) {
    this.bot.telegram.sendMessage(chatId, payload);
  }
}
