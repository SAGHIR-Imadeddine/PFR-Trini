import { 
    IsString, 
    IsNotEmpty, 
    MinLength, 
    MaxLength, 
    IsOptional
} from 'class-validator';

export class CreateGymDto {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 characters' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    name: string;

    @IsOptional()
    @IsString({ message: 'Address must be a string' })
    @MaxLength(200, { message: 'Address cannot exceed 200 characters' })
    address?: string;
}
