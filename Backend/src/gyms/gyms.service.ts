import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gym, GymDocument } from './entities/gym.entity';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { UserDocument, UserRole } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GymsService {
    constructor(
        @InjectModel(Gym.name) private readonly gymModel: Model<GymDocument>,
        private readonly usersService: UsersService,
    ) {}

    async create(createGymDto: CreateGymDto, user: UserDocument): Promise<Gym> {
        if(user.role !== UserRole.OWNER) throw new UnauthorizedException();
        
        const createdGym = new this.gymModel({...createGymDto, owner: user._id});
        await createdGym.save();
        
        const userGyms = await this.usersService.findOne(user._id.toString());
        userGyms.gyms?.push(createdGym._id);

        await this.usersService.update(user._id.toString(), { gyms: userGyms.gyms });
        return createdGym;
    }

    async findAll(): Promise<Gym[]> {
        return this.gymModel.find().exec();
    }

    async findOne(id: string): Promise<Gym> {
        const gym = await this.gymModel.findById(id).exec();
        if (!gym) {
            throw new NotFoundException(`Gym with ID ${id} not found`);
        }
        return gym;
    }

    async update(id: string, updateGymDto: UpdateGymDto): Promise<Gym> {
        const updatedGym = await this.gymModel
            .findByIdAndUpdate(id, updateGymDto, { new: true })
            .exec();
        if (!updatedGym) {
            throw new NotFoundException(`Gym with ID ${id} not found`);
        }
        return updatedGym;
    }

    async remove(id: string): Promise<Gym> {
        const deletedGym = await this.gymModel.findByIdAndDelete(id).exec();
        if (!deletedGym) {
            throw new NotFoundException(`Gym with ID ${id} not found`);
        }
        return deletedGym;
    }
}
