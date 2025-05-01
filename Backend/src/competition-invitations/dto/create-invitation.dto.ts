import { IsMongoId, IsNotEmpty } from 'class-validator';


export class CreateInvitationDto {
  @IsNotEmpty() 
  @IsMongoId() 
  competition: string;

  @IsNotEmpty() 
  @IsMongoId() 
  sourceGym: string;
  
  @IsNotEmpty() 
  @IsMongoId() 
  targetGym: string;
  
}
