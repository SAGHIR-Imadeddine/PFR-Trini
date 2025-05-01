import { Module } from '@nestjs/common';
import { CompetitionInvitationsService } from './competition-invitations.service';
import { CompetitionInvitationsController } from './competition-invitations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompetitionInvitation, CompetitionInvitationSchema } from './entities/competition-invitation.entity';
import { CompetitionsModule } from '../competitions/competitions.module';
import { GymsModule } from '../gyms/gyms.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CompetitionInvitation.name, schema: CompetitionInvitationSchema }]),
    CompetitionsModule,
    //GymsModule
  ],
  controllers: [CompetitionInvitationsController],
  providers: [CompetitionInvitationsService],
})
export class CompetitionInvitationsModule {}
