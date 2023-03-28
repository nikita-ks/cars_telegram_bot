import { Injectable } from '@nestjs/common';
import { BotProvider } from 'src/integration/bot/bot.provider';
import { VinHandler } from 'src/telegraf/vin.scene';
import { Scenes, session } from 'telegraf';

@Injectable()
export class TelegrafService {
  constructor(private botProvider: BotProvider) {
    const vinHandling = new VinHandler();
    const stage = new Scenes.Stage<Scenes.SceneContext>([vinHandling.scene]);
    this.botProvider.bot.use(session());
    this.botProvider.bot.use(stage.middleware());
    this.configure();
  }
  private configure(): void {
    this.botProvider.bot.start((ctx) => {
      ctx.reply('Hi');
    });
  }
}
