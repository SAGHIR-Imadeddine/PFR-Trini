import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GymDocument = HydratedDocument<Gym>;

@Schema({
  collection: 'gyms',
  timestamps: true,
  versionKey: false,
})
export class Gym {
  @Prop({ required: true })
  name: string;

  @Prop()
  address?: string;
}

export const GymSchema = SchemaFactory.createForClass(Gym);
GymSchema.index({ name: 1 });
