import { Logger } from '@nestjs/common';
import { SceneIds } from 'src/config/constants';
import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';

export class VinCollectScene {
  logger: Logger;
  scene: Scenes.BaseScene<Scenes.SceneContext>;
  constructor() {
    this.scene = new Scenes.BaseScene<Scenes.SceneContext>(SceneIds.collect);
    this.configure();
    this.logger = new Logger('VinCollectScene');
  }

  private configure(): void {
    this.scene.enter((ctx) => {
      ctx.reply('Enter your vin code');
    });

    this.scene.on(message('text'), async (ctx) => {
      //TODO: validate user input(spaces, regex, numbers)
      const vinCode = ctx.message.text;
      this.logger.log(`user entered VIN: ${vinCode}`);
      ctx.reply('Your report is preparing...');
      ctx.scene.enter(SceneIds.response, { vinCode });
    });
  }
}
