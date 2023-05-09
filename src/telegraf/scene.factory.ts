import { ParserService } from 'src/parser/parser.service';
import { VinCollectScene } from 'src/telegraf/vinCollect.scene';
import { VinResponseScene } from 'src/telegraf/vinResponse.scene';

export const SceneFactory = (parser: ParserService) => {
  const vinCollectScene = new VinCollectScene();
  const responseScene = new VinResponseScene(parser);
  return [vinCollectScene.scene, responseScene.scene];
};
