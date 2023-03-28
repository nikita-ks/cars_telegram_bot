import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from 'src/integration/bot/bot.module';
import { BotProvider } from 'src/integration/bot/bot.provider';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/config';
import { TelegrafModule } from './telegraf/telegraf.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TelegrafModule,
    BotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private config: ConfigService,
    private botProvider: BotProvider,
  ) {}
  getListenPort(): number {
    return this.config.get<number>('port');
  }

  async onModuleInit() {
    this.botProvider.bot.launch();
  }
}
