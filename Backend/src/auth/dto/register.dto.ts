import { 
    IsString, 
    IsNotEmpty, 
    MinLength,
    MaxLength, 
    IsEmail,
    IsEnum,
    IsOptional,
    IsArray
} from "class-validator";
import { UserRole } from "src/users/entities/user.entity";
import { Types } from "mongoose";

export class RegisterDto {
    
    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    @MinLength(3, { message: 'A Valid Password is in the range of 8 to 26 character' })
    @MaxLength(20, { message: 'A Valid Password is in the range of 8 to 26 character' })
    name : string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a string' })
    email : string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Pass must be a string' })
    @MinLength(8, { message: 'A Valid Password is in the range of 8 to 26 character' })
    @MaxLength(26, { message: 'A Valid Password is in the range of 8 to 26 character' })
    password : string;
    
    @IsNotEmpty({ message: 'Role is required' })
    @IsEnum(UserRole, { message: 'Role must be SUPER_ADMIN, OWNER, or EMPLOYEE' })
    role: UserRole;

    @IsOptional()
    @IsArray({ message: 'Gyms must be an array of Gym IDs' })
    gyms?: Types.ObjectId[];    
}
