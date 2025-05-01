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
    IsMongoId
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

export enum SubscriptionType {
    MONTHLY = 'monthly',
    YEARLY = 'yearly'
}

export class CreateMemberDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    name: string;

    @IsNotEmpty({ message: 'CIN is required' })
    @IsString({ message: 'CIN must be a string' })
    @MinLength(6, { message: 'CIN must be at least 5 characters' })
    @MaxLength(12, { message: 'CIN cannot exceed 12 characters' })
    cin: string;

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

    @IsNotEmpty({ message: 'Subscription type is required' })
    @IsEnum(SubscriptionType, { message: 'Subscription type must be either monthly or yearly' })
    subscriptionType: SubscriptionType;

    @IsNotEmpty({ message: 'Subscription start date is required' })
    @IsDate({ message: 'Subscription start date must be a valid date' })
    @Type(() => Date)
    subscriptionStartDate: Date;

    @IsNotEmpty({ message: 'Subscription end date is required' })
    @IsDate({ message: 'Subscription end date must be a valid date' })
    @Type(() => Date)
    subscriptionEndDate: Date;

    @IsNotEmpty({ message: 'Gym ID is required' })
    @IsMongoId({ message: 'Invalid Gym ID' })
    gym: string;
}
