import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CompetitionInvitation, CompetitionInvitationDocument, InvitationStatus, InvitationType } from './entities/competition-invitation.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CompetitionsService } from 'src/competitions/competitions.service';
import { GymsService } from 'src/gyms/gyms.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UserDocument } from 'src/users/entities/user.entity';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@Injectable()
export class CompetitionInvitationsService {
    constructor(
        @InjectModel(CompetitionInvitation.name) private readonly invitationModel: Model<CompetitionInvitationDocument>,
        private readonly competitonService : CompetitionsService,
        //private readonly gymService : GymsService,
    ){}

    async invite(createDTO : CreateInvitationDto, user : UserDocument){
        const competition = await this.competitonService.findOne(createDTO.competition);

        if(!competition) throw new NotFoundException('Competion not Found');
        if(!user.gyms?.includes(competition.hostGym)) throw new ForbiddenException();

        const invitation = new this.invitationModel({
            ...createDTO,
            sourceGym : competition.hostGym,
            type : InvitationType.OUTBOUND,
            status : InvitationStatus.PENDING
        });
        return await invitation.save();
    }

    async request(createDTO : CreateInvitationDto, user : UserDocument){
        const competition = await this.competitonService.findOne(createDTO.competition);

        if(!competition) throw new NotFoundException('Competion not Found');
        if(competition.invitedGyms?.map(gymId => gymId.toString()).includes(createDTO.sourceGym)) 
            throw new BadRequestException('Your Gym is already invited');
        
        const invitation = new this.invitationModel({
            ...createDTO,
            targetGym : competition.hostGym,
            type : InvitationType.INBOUND,
            status : InvitationStatus.PENDING
        });
        return await invitation.save();
    }

    async respond(id: string, updateDto: UpdateInvitationDto, user: UserDocument){
        const invitation = await this.invitationModel.findById(id);

        if(!invitation) throw new NotFoundException('Invitation not Found');
        if(!user.gyms?.includes(invitation.targetGym)) throw new ForbiddenException();

        invitation.status = updateDto.status;
        invitation.actedBy = user._id;
        await invitation.save();

        if (invitation.status === InvitationStatus.ACCEPTED) {
            const competitionId = invitation.competition.toString();
            const competition = await this.competitonService.findOne(competitionId);
            
            const updateDto: any = {};
            
            if(invitation.type === InvitationType.OUTBOUND) {
                const targetGymId = invitation.targetGym.toString();
                updateDto.invitedGyms = [...(competition.invitedGyms?.map(gym => gym.toString()) || []), targetGymId];
            }
            
            if(invitation.type === InvitationType.INBOUND) {
                const sourceGymId = invitation.sourceGym.toString();
                updateDto.invitedGyms = [...(competition.invitedGyms?.map(gym => gym.toString()) || []), sourceGymId];
            }
            
            await this.competitonService.update(competitionId, updateDto);
        }
        return invitation;
    }

    async myInvitations(gymId: string){ // host sends
        return await this.invitationModel.find({targetGym: gymId, status: InvitationStatus.PENDING})
        .populate('competition hostGym sourceGym')
        .exec();
    }

    async myRequests(gymId: string){ // host recieves
        return await this.invitationModel.find({sourceGym: gymId, status: InvitationStatus.PENDING})
        .populate('competition hostGym targetGym')
        .exec();
    }
}
