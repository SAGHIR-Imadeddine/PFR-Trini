import { 
    IsString, 
    IsNotEmpty, 
    MinLength, 
    MaxLength, 
    IsEmail, 
    IsEnum,
    IsOptional,
    IsDate,
    IsPhoneNumber,
    IsMongoId,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

export enum SubscriptionType {
    MONTHLY = 'monthly',
    YEARLY = 'yearly'
}

export class SubscriptionDto {
    @IsNotEmpty()
    @IsEnum(SubscriptionType, { message: 'Subscription type must be either monthly or yearly' })
    type: SubscriptionType;

    @IsNotEmpty()
    @IsDate({ message: 'Start date must be a valid date' })
    @Type(() => Date)
    startDate: Date;

    @IsNotEmpty()
    @IsDate({ message: 'End date must be a valid date' })
    @Type(() => Date)
    endDate: Date;
}

export class CreateMemberDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    name: string;

    @IsOptional()
    @IsEmail({}, { message: 'Enter a valid email' })
    email?: string;

    @IsNotEmpty({ message: 'Gender is required' })
    @IsEnum(Gender, { message: 'Gender must be either male or female' })
    gender: Gender;

    @IsOptional()
    @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
    phone?: string;

    @IsOptional()
    @IsDate({ message: 'Date of birth must be a valid date' })
    @Type(() => Date)
    dateOfBirth?: Date;

    @IsNotEmpty({ message: 'Subscription is required' })
    @ValidateNested()
    @Type(() => SubscriptionDto)
    subscription: SubscriptionDto;

    @IsNotEmpty({ message: 'Gym ID is required' })
    @IsMongoId({ message: 'Invalid Gym ID' })
    gym: Types.ObjectId;

    @IsNotEmpty({ message: 'Creator ID is required' })
    @IsMongoId({ message: 'Invalid Creator ID' })
    createdBy: Types.ObjectId;
}
