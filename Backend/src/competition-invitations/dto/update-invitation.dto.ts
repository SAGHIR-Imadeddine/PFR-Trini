import { IsEnum, IsNotEmpty } from 'class-validator';
import { InvitationStatus } from '../entities/competition-invitation.entity';

export class UpdateInvitationDto {
  @IsNotEmpty()
  @IsEnum(InvitationStatus)
  status: InvitationStatus;
}