import { Injectable } from '@nestjs/common';
import { ParserService } from '../parser/parser.service';
import { Scenes } from 'telegraf';

const VIN_SCENE = 'vin_response_scene';
type TRenderValue = { title: string; data: Record<string, string>[] }[];
const render = (value: TRenderValue): string => {
  return value
    .map((v) => {
      const recordsCount = v.data.length;

      const formattedList = v.data
        .map((value) => {
          const list = Object.entries(value)
            .map(([key, v]) => `*${key}:* ${v.replace(/[.\-]/g, '\\$&')}\n`)
            .join('')
            .slice(0, -1);
          return `\n${list}\n`;
        })
        .join('');
      return `*${v.title}* \\(${recordsCount} records found\\)\n${formattedList}`;
    })
    .join('\n');
};

@Injectable()
export class VinResponseScene {
  scene: Scenes.BaseScene<Scenes.SceneContext>;
  constructor(private parserService: ParserService) {
    this.scene = new Scenes.BaseScene<Scenes.SceneContext>(VIN_SCENE);
    this.configure();
  }

  private configure(): void {
    this.scene.enter(async (ctx) => {
      const state = ctx.scene.state as { vinCode: string };
      const response = await this.parserService.parseResources(state.vinCode);
      ctx.replyWithMarkdownV2(render(response));
      ctx.scene.leave();
    });
  }
}
