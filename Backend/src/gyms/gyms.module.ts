import { Module } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { GymsController } from './gyms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gym, GymSchema } from './entities/gym.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gym.name, schema: GymSchema }]),
    UsersModule
  ],
  controllers: [GymsController],
  providers: [GymsService],
  exports: [GymsService]
})
export class GymsModule {}
