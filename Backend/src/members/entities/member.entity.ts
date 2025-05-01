import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Gym } from '../../gyms/entities/gym.entity';
import { User } from '../../users/entities/user.entity';

export type MemberDocument = HydratedDocument<Member>;

@Schema({
  collection: 'members',
  timestamps: true,
  versionKey: false,
})
export class Member {
  @Prop({ required: true })
  name: string;
  
  @Prop({ required: true, unique: true })
  cin: string;

  @Prop({ unique: true })
  email?: string;

  @Prop({ required: true, enum: ['male', 'female'] })
  gender: string;

  @Prop()
  phone?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ required: true, enum: ['monthly', 'yearly'] })
  subscriptionType: string;

  @Prop({ required: true })
  subscriptionStartDate: Date;

  @Prop({ required: true })
  subscriptionEndDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Gym', required: true })
  gym: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
MemberSchema.index({ gym: 1 });
