import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsDate,
    IsMongoId
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { EquipmentStatus } from '../entities/equipement.entity';
  
  export class CreateEquipmentDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;
  
    @IsNotEmpty({ message: 'Status is required' })
    @IsEnum(EquipmentStatus, { message: 'Status must be AVAILABLE or MAINTENANCE' })
    status: EquipmentStatus;
  
    @IsOptional()
    @IsDate({ message: 'Purchase date must be a valid date' })
    @Type(() => Date)
    purchaseDate?: Date;
  
    @IsNotEmpty({ message: 'Gym ID is required' })
    @IsMongoId({ message: 'Invalid Gym ID' })
    gym: string;
  
    // @IsNotEmpty({ message: 'Creator ID is required' })
    // @IsMongoId({ message: 'Invalid creator ID' })
    // createdBy: string;
  }
  
