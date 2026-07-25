import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose/dist/common/mongoose.decorators';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) {}

    async findByEmail(email: string){
        return this.userModel.findOne({email})
    }
    async create(userData: Partial<User>) {
        const user = new this.userModel(userData);
        return user.save();
    }
    async findByEmailAndPassword(email: string){
        return this.userModel.findOne({email}).select('+password');
    }
    async findById(id: string) {
        return this.userModel.findById(id);
    }
}
