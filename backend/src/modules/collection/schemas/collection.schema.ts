import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CollectionDocument = HydratedDocument<Collection>

@Schema({timestamps: true})

export class Collection{
    @Prop({
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    })
    name!: string

    @Prop({
        default: "",
        maxlength: 500
    })
    description!: string

    @Prop({
        type: Types.ObjectId,
        ref: "Workspace",
        required: true,
        index: true
    })
    workspaceId!: Types.ObjectId;

     @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  ownerId!: Types.ObjectId;

  @Prop({
    default: 0,
  })
  sortOrder!: number;

  @Prop({
    default: '#6366F1',
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

export const CollectionSchema = SchemaFactory.createForClass(Collection)