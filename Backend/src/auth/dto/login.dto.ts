import { 
    IsString, 
    IsNotEmpty, 
    IsEmail
} from "class-validator";

export class loginDto {
    
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a string' })
    email : string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Pass must be a string' })
    password : string;
}
