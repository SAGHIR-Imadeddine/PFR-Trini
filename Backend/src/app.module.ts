import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { GymsModule } from './gyms/gyms.module';
import { MembersModule } from './members/members.module';
import { EquipementsModule } from './equipements/equipements.module';
import { CompetitionsModule } from './competitions/competitions.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load : [config],
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports : [ConfigModule],
      inject : [ConfigService],
      useFactory : async (configService: ConfigService) => ({
        uri: configService.get<string>('DB.URI')
      })
    }),
    UsersModule,
    GymsModule,
    MembersModule,
    EquipementsModule,
    CompetitionsModule,

  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
