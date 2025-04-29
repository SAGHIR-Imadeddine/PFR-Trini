import {
    IsString,
    IsNotEmpty,
    IsDate,
    IsMongoId,
    IsOptional,
    IsArray,
    ArrayUnique,
    ValidateNested
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateCompetitionDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    name: string;
  
    @IsNotEmpty({ message: 'Type is required' })
    @IsString({ message: 'Type must be a string' })
    type: string;
  
    @IsNotEmpty({ message: 'Date is required' })
    @IsDate({ message: 'Date must be a valid date' })
    @Type(() => Date)
    date: Date;
  
    @IsNotEmpty({ message: 'Host gym ID is required' })
    @IsMongoId({ message: 'Invalid host gym ID' })
    hostGym: string;
  
    @IsOptional()
    @IsArray({ message: 'Invited gyms must be an array' })
    @ArrayUnique()
    @IsMongoId({ each: true, message: 'Each invited gym ID must be valid' })
    invitedGyms?: string[];
  
    @IsOptional()
    @IsArray({ message: 'Participants must be an array' })
    @ArrayUnique()
    @IsMongoId({ each: true, message: 'Each participant ID must be valid' })
    participants?: string[];
  }
  
