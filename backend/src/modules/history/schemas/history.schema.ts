import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HistoryDocument = HydratedDocument<History>;

@Schema({
  timestamps: true,
})
export class History {
  @Prop({
    type: Types.ObjectId,
    ref: 'Request',
    required: true,
  })
  requestId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspaceId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Collection',
    required: true,
  })
  collectionId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  ownerId!: Types.ObjectId;

  @Prop({
    required: true,
  })
  method!: string;

  @Prop({
    required: true,
  })
  url!: string;

  @Prop({
    type: Object,
    default: {},
  })
  requestHeaders!: Record<string, any>;

  @Prop({
    type: Object,
    default: {},
  })
  requestBody: any;

  @Prop({
    required: true,
  })
  responseStatus!: number;

  @Prop({
    default: '',
  })
  statusText!: string;

  @Prop({
    type: Object,
    default: {},
  })
  responseHeaders!: Record<string, any>;

  @Prop({
    type: Object,
    default: {},
  })
  responseBody: any;

  @Prop({
    required: true,
  })
  responseTime!: number;

  @Prop({
    default: 0,
  })
  responseSize!: number;

  @Prop({
    default: false,
  })
  isError!: boolean;

  @Prop()
  errorMessage?: string;

  @Prop({
    default: Date.now,
  })
  executedAt!: Date;
  @Prop({
    default: false,
  })
  isDeleted!: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt!: Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);
