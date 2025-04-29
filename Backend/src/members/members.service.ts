import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Member, MemberDocument } from './entities/member.entity';
import { Model } from 'mongoose';

@Injectable()
export class MembersService {

  constructor(
    @InjectModel(Member.name) private memberModel : Model<MemberDocument>
  ){}

  async create(createMemberDto: CreateMemberDto) : Promise<Member> {
    const newMember = new this.memberModel(createMemberDto);
    return await newMember.save();
  }

  findAll() : Promise<Member[]> {
    return this.memberModel.find().exec();
  }

  async findOne(id: string) : Promise<Member>{
    const member = await this.memberModel.findById(id).exec();
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto) : Promise<Member> {
    const updatedMember = await this.memberModel.findByIdAndUpdate(id, updateMemberDto, {new: true}).exec();
    if (!updatedMember) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return updatedMember
  }

  async remove(id: string) : Promise<Member> {
    const deletedMember = await this.memberModel.findByIdAndDelete(id).exec();
    if (!deletedMember) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return deletedMember
  }
}
