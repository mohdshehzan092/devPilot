import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserRole } from "src/common/enums/user-role.enum";
import { UserStatus } from "src/common/enums/user-status.enum";


export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true,
    collection : 'users',
})

export class User {
    @Prop({
        required: true,
        trim: true
    })
    name!: string;

    @Prop({
        required: true,
        unique: true,
        trim: true,
        lowercase: true
        
    })
    email!: string;

    @Prop({
        required: true,
        select: false
    })
    password!: string;

    @Prop({
        default: null,
    })
    avatar? : string;

    @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
})
role: UserRole = UserRole.USER;

    @Prop({
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.ACTIVE,
})
status: UserStatus = UserStatus.ACTIVE;

    @Prop({
        default: false,
    })
    isVerified: boolean = false;

    @Prop({
        default: null
    })
    lastLogin?: Date;

    @Prop({
        default: false
    })
    isDeleted: boolean = false;

    @Prop({
        default: null
    })
    deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User)