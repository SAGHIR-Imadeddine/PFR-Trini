import { 
    IsString, 
    IsNotEmpty, 
    MinLength, 
    MaxLength, 
    IsEmail, 
    // IsEnum,
    IsOptional,
    IsArray
} from 'class-validator';
// import { UserRole } from '../entities/user.entity';
import { Types } from 'mongoose';

export class CreateUserDto {
    
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'A valid name must be between 3 and 30 characters' })
    @MaxLength(30, { message: 'A valid name must be between 3 and 30 characters' })
    name: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Enter a valid email' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'A valid password must be between 8 and 26 characters' })
    @MaxLength(26, { message: 'A valid password must be between 8 and 26 characters' })
    password: string;

    // @IsNotEmpty({ message: 'Role is required' })
    // @IsEnum(UserRole, { message: 'Role must be SUPER_ADMIN, OWNER, or EMPLOYEE' })
    // role: UserRole;

    @IsOptional()
    @IsArray({ message: 'Gyms must be an array of Gym IDs' })
    gyms?: Types.ObjectId[];
}

