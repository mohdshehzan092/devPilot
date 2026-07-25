import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

export type EnvironmentDocument =
  HydratedDocument<Environment>;

@Schema({ _id: false })
class Variable {
  @Prop({
    required: true,
  })
  key!: string;

  @Prop({
    required: true,
  })
  value!: string;
}

@Schema({
  timestamps: true,
})
export class Environment {
  @Prop({
    required: true,
  })
  name!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspaceId!: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  ownerId!: Types.ObjectId;

  @Prop({
    type: [Variable],
    default: [],
  })
  variables!: Variable[];

  @Prop({
    default: false,
  })
  isDeleted!: boolean;

  @Prop({
    default: null,
  })
  deletedAt!: Date;
}

export const EnvironmentSchema = SchemaFactory.createForClass(Environment);