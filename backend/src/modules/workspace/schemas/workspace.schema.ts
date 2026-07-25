import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WorkspaceDocument = HydratedDocument<Workspace>;

export enum WorkspaceVisibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

@Schema({
  timestamps: true,
})
export class Workspace {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  })
  slug!: string;

  @Prop({
    default: '',
    maxlength: 500,
  })
  description!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  ownerId!: Types.ObjectId;

  @Prop({
    enum: WorkspaceVisibility,
    default: WorkspaceVisibility.PRIVATE,
  })
  visibility!: WorkspaceVisibility;

  @Prop({
    default: '',
  })
  icon!: string;

  @Prop({
    default: '#3B82F6',
  })
  color!: string;

  @Prop({
    default: false,
  })
  isDeleted!: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt!: Date | null;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);