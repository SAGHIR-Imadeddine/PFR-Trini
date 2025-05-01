import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CompetitionInvitationsService } from './competition-invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { Authenticated } from 'src/auth/authenticated.decorator';
import { UserDocument } from 'src/users/entities/user.entity';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@Controller('invitations')
export class CompetitionInvitationsController {
  constructor(
    private readonly InvitationsService: CompetitionInvitationsService
  ) {}

  @Post('invite')
  invite(@Body()createDto : CreateInvitationDto, @Authenticated() user : UserDocument){
    return this.InvitationsService.invite(createDto, user);
  }
  
  @Post('request')
  request(@Body()createDto : CreateInvitationDto, @Authenticated() user : UserDocument){
    return this.InvitationsService.request(createDto, user);
  }

  @Patch(':id/respond')
  respond(
    @Param('id') id:string, 
    @Body() updateDto: UpdateInvitationDto, 
    @Authenticated() user: UserDocument
  ){
    return this.InvitationsService.respond(id, updateDto, user);
  }

  @Get(':id/invited')
  getMyInvitations(@Param('id') gymId : string){
    return this.InvitationsService.myInvitations(gymId);
  }
  
  @Get(':id/requested')
  getMyRequests(@Param('id') gymId : string){
    return this.InvitationsService.myRequests(gymId);
  }

}
