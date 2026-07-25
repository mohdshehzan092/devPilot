import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { KeyValue } from '../../../common/types/key-value.type';
import type { RequestAuth } from '../../../common/types/auth.type';

import { BodyType } from '../../../common/types/body-type.enum';
import { RequestMethod } from '../../../common/enums/request-method.enum';

export type RequestDocument = HydratedDocument<Request>;

@Schema({
  timestamps: true,
})
export class Request {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    default: '',
  })
  description!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true,
  })
  workspaceId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Collection',
    required: true,
    index: true,
  })
  collectionId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  ownerId!: Types.ObjectId;
  @Prop({
    enum: RequestMethod,
    required: true,
  })
  method!: RequestMethod;

  @Prop({
    required: true,
  })
  url!: string;

  @Prop({
    type: [Object],
    default: [],
  })
  headers!: KeyValue[];

  @Prop({
    type: [Object],
    default: [],
  })
  queryParams!: KeyValue[];
  @Prop({
    type: [Object],
    default: [],
  })
  pathParams!: KeyValue[];

  @Prop({
    default: '',
  })
  body!: string;

  @Prop({
    enum: BodyType,
    default: BodyType.NONE,
  })
  bodyType!: BodyType;

  @Prop({
    type: Object,
    default: {},
  })
  auth!: RequestAuth;

  @Prop({
    default: '',
  })
  aiPrompt!: string;

  @Prop({
    default: '',
  })
  generatedBody!: string;

  @Prop({
    default: 0,
  })
  sortOrder!: number;

  @Prop({
    default: false,
  })
  isDeleted!: boolean;

  @Prop({
    default: null,
  })
  deletedAt!: Date;

  @Prop({
    default: false,
  })
  isAIGenerated!: boolean;
  @Prop({
  type: Types.ObjectId,
  ref: 'Environment',
  default: null,
})
environmentId!: Types.ObjectId;

@Prop({
  default: '',
})
testScript!: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
