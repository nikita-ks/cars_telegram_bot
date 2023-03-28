import { VIN_SCENE } from 'src/integration/constants';
import { Scenes } from 'telegraf';
import { message } from 'telegraf/filters';

export class VinHandler {
  scene: Scenes.BaseScene<Scenes.SceneContext>;
  constructor() {
    this.scene = new Scenes.BaseScene<Scenes.SceneContext>(VIN_SCENE);
    this.configure();
  }

  private configure(): void {
    this.scene.enter((ctx) => {
      ctx.reply('ENTER YOUR VIN');
    });

    this.scene.on(message('text'), (ctx) => {
      const vin = ctx.message.text;
      ctx.reply('YOUR REPORT IS PREPARING');
      console.log(vin);
      ctx.scene.leave();
    });
  }
}
