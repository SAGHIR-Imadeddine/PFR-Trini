import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Gym } from '../../gyms/entities/gym.entity';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
  EMPLOYEE = 'EMPLOYEE',
}

@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ type: [Types.ObjectId], ref: 'Gym', default: [] })
  gyms?: Types.ObjectId[] | Gym[];
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });