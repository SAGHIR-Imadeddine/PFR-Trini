import { Module } from '@nestjs/common';
import { EquipementsService } from './equipements.service';
import { EquipementsController } from './equipements.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Equipment, EquipmentSchema } from './entities/equipement.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Equipment.name, schema: EquipmentSchema }])],
  controllers: [EquipementsController],
  providers: [EquipementsService],
})
export class EquipementsModule {}
