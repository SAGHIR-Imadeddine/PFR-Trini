import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type CompetitionInvitationDocument = HydratedDocument<CompetitionInvitation>;

export enum InvitationType {
  OUTBOUND = 'OUTBOUND',   // host → gym
  INBOUND  = 'INBOUND',    // gym → host
}

export enum InvitationStatus {
  PENDING  = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REFUSED  = 'REFUSED',
}

@Schema({ collection: 'competition_invitations', timestamps: true })
export class CompetitionInvitation {
  @Prop({ type: Types.ObjectId, ref: 'Competition', required: true })
  competition: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Gym', required: true })
  sourceGym: Types.ObjectId;    

  @Prop({ type: Types.ObjectId, ref: 'Gym', required: true })
  targetGym: Types.ObjectId;

  @Prop({ required: true, enum: InvitationType })
  type: InvitationType;

  @Prop({ required: true, enum: InvitationStatus, default: InvitationStatus.PENDING })
  status: InvitationStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  actedBy?: Types.ObjectId;
}

export const CompetitionInvitationSchema = SchemaFactory.createForClass(CompetitionInvitation);
CompetitionInvitationSchema.index({ competition: 1, targetGym: 1 }, { unique: true });