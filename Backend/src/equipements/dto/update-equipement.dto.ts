import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentDto } from './create-equipement.dto';

export class UpdateEquipementDto extends PartialType(CreateEquipmentDto) {}
