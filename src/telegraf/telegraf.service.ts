import { Injectable } from '@nestjs/common';
import { BotProvider } from '../integration/bot/bot.provider';

import { SceneFactory } from 'src/telegraf/scene.factory';
import { Scenes, session } from 'telegraf';
import { ParserService } from 'src/parser/parser.service';
import { SceneIds } from 'src/config/constants';

@Injectable()
export class TelegrafService {
  constructor(private botProvider: BotProvider, private parserService: ParserService) {
    const scenes = SceneFactory(this.parserService);
    const stage = new Scenes.Stage<Scenes.SceneContext>(scenes);
    this.botProvider.bot.use(session());
    this.botProvider.bot.use(stage.middleware());
    this.configure();
  }
  private configure(): void {
    // all root bot commands
    this.botProvider.bot.start((ctx) => {
      ctx.scene.enter(SceneIds.collect);
      return;
    });
  }
}
