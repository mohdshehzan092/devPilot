import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class BaseSchema {
  @Prop({
    default: false,
  })
  isDeleted: boolean = false;

  @Prop({
    default: null,
  })
  deletedAt?: Date;
}