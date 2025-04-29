import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from './entities/equipement.entity';

@Injectable()
export class EquipementsService {
  constructor(
    @InjectModel(Equipment.name) private readonly equipmentModel: Model<EquipmentDocument>,
  ) {}

  async create(createEquipementDto: CreateEquipmentDto) : Promise<Equipment> {
    const newEquipment = new this.equipmentModel(createEquipementDto);
    return await newEquipment.save();
  }

  async findAll() : Promise<Equipment[]> {
    return await this.equipmentModel.find().exec();
  }

  async findOne(id: string) : Promise<Equipment>{
    const equipement = await this.equipmentModel.findById(id).exec();
    if (!equipement) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return equipement;
  }

  async update(id: string, updateEquipementDto: UpdateEquipementDto) : Promise<Equipment>{
    const updatedEquipment = await this.equipmentModel.findByIdAndUpdate(id, updateEquipementDto, {new : true}).exec();
    if (!updatedEquipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return updatedEquipment;
  }

  async remove(id: string) : Promise<Equipment>{
    const deletedEquipment = await this.equipmentModel.findByIdAndDelete(id).exec();
    if (!deletedEquipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return deletedEquipment;
  }
}
