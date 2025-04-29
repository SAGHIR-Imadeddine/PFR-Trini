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
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/auth.guard';

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
    AuthModule,

  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide : APP_GUARD,
      useClass : JwtAuthGuard 
    }
  ],
})
export class AppModule {}
