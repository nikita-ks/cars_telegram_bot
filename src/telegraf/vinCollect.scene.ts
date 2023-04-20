import { Injectable, Logger } from '@nestjs/common';
import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';
import { VinResponseScene } from '../telegraf/vinResponse.scene';

const VIN_SCENE = 'vin_collect_scene';

@Injectable()
export class VinCollectScene {
  logger: Logger;
  scene: Scenes.BaseScene<Scenes.SceneContext>;
  constructor(private vinResponseScene: VinResponseScene) {
    this.scene = new Scenes.BaseScene<Scenes.SceneContext>(VIN_SCENE);
    this.configure();
    this.logger = new Logger('VinCollectScene');
  }

  private configure(): void {
    this.scene.enter((ctx) => {
      ctx.reply('Enter your vin code');
    });

    this.scene.on(message('text'), async (ctx) => {
      const vinCode = ctx.message.text;
      this.logger.log(`user entered VIN: ${vinCode}`);
      ctx.reply('Your report is preparing...');
      ctx.scene.leave();
      ctx.scene.enter(this.vinResponseScene.scene.id, { vinCode });
    });
  }
}
