import { Injectable } from '@nestjs/common';
import { BotProvider } from '../integration/bot/bot.provider';
import { VinCollectScene } from '../telegraf/vinCollect.scene';
import { VinResponseScene } from '../telegraf/vinResponse.scene';

import { Scenes, session } from 'telegraf';

@Injectable()
export class TelegrafService {
  constructor(
    private botProvider: BotProvider,
    private vinCollectScene: VinCollectScene,
    private vinResponseScene: VinResponseScene,
  ) {
    const stage = new Scenes.Stage<Scenes.SceneContext>([this.vinCollectScene.scene, this.vinResponseScene.scene]);
    this.botProvider.bot.use(session());
    this.botProvider.bot.use(stage.middleware());
    this.configure();
  }
  private configure(): void {
    // all root bot commands
    this.botProvider.bot.start((ctx) => {
      ctx.scene.enter(this.vinCollectScene.scene.id);
      return;
    });
  }
}
