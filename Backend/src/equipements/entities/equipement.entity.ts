import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Gym } from '../../gyms/entities/gym.entity';
import { User } from '../../users/entities/user.entity';

export type EquipmentDocument = HydratedDocument<Equipment>;

export enum EquipmentStatus {
  AVAILABLE = 'AVAILABLE',
  MAINTENANCE = 'MAINTENANCE',
}

@Schema({
  collection: 'equipment',
  timestamps: true,
  versionKey: false,
})
export class Equipment {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: EquipmentStatus })
  status: EquipmentStatus;

  @Prop()
  purchaseDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Gym', required: true })
  gym: Types.ObjectId | Gym;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId | User;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
EquipmentSchema.index({ gym: 1 });