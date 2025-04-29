import { Module } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { GymsController } from './gyms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gym, GymSchema } from './entities/gym.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Gym.name, schema: GymSchema }])],
  controllers: [GymsController],
  providers: [GymsService],
})
export class GymsModule {}
