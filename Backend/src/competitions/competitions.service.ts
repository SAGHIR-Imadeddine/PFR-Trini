import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Competition, CompetitionDocument } from './entities/competition.entity';
import { Model } from 'mongoose';

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectModel(Competition.name) private readonly competitionModel: Model<CompetitionDocument>,
  ) {}

  async create(createCompetitionDto: CreateCompetitionDto) : Promise<Competition> {
    const newCompetition = new this.competitionModel(createCompetitionDto);
    return await newCompetition.save();
  }

  async findAll() : Promise<Competition[]> {
    return await this.competitionModel.find()
    .populate('hostGym', 'name')
    .exec();
  }

  async findOne(id: string) : Promise<Competition>{
    const competition = await this.competitionModel.findById(id)
    .populate('hostGym', 'name')
    .populate({
      path :'invitedGyms',
      model : 'Gym',
      select : 'name'
    })
    .populate({
      path :'participants',
      model : 'Member',
      select : 'name gender dateOfBirth gym'
    })
    .exec();
    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return competition;
  }

  async update(id: string, updateCompetitionDto: UpdateCompetitionDto) {
    const updatedCompetition = await this.competitionModel.findByIdAndUpdate(id, updateCompetitionDto, {new : true}).exec();
    if (!updatedCompetition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return updatedCompetition;
  }

  async remove(id: string) {
    const deletedCompetition = await this.competitionModel.findByIdAndDelete(id).exec();
    if (!deletedCompetition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }
    return deletedCompetition;
  }
}
