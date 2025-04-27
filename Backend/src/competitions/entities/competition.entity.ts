import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Gym } from '../../gyms/entities/gym.entity';
import { Member } from '../../members/entities/member.entity';

export type CompetitionDocument = HydratedDocument<Competition>;

@Schema({
  collection: 'competitions',
  timestamps: true,
  versionKey: false,
})
export class Competition {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Gym', required: true })
  hostGym: Types.ObjectId | Gym;

  @Prop({ type: [Types.ObjectId], ref: 'Gym' })
  invitedGyms?: Types.ObjectId[] | Gym[];

  @Prop({ type: [Types.ObjectId], ref: 'Member' })
  participants?: Types.ObjectId[] | Member[];
}

export const CompetitionSchema = SchemaFactory.createForClass(Competition);
CompetitionSchema.index({ hostGym: 1, date: 1 });

