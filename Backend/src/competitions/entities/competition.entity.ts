import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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
  hostGym: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Gym', default: [] })
  invitedGyms?: Types.ObjectId[] | [];

  @Prop({ type: [Types.ObjectId], ref: 'Member', default: [] })
  participants?: Types.ObjectId[] | [];
}

export const CompetitionSchema = SchemaFactory.createForClass(Competition);
CompetitionSchema.index({ hostGym: 1, date: 1 });

