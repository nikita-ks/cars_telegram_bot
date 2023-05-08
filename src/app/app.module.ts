import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from '../integration/bot/bot.module';
import { BotProvider } from 'src/integration/bot/bot.provider';
import configuration from '../config/config';
import { TelegrafModule } from '../telegraf/telegraf.module';
import { ParserModule } from '../parser/parser.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), TelegrafModule, BotModule, ParserModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private config: ConfigService, private botProvider: BotProvider) {}

  getListenPort(): number {
    return this.config.get<number>('port');
  }

  async onModuleInit() {
    this.botProvider.launch();
  }
}
