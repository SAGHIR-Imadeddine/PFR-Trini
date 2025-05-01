import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EquipementsService } from './equipements.service';
import { CreateEquipmentDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';
import { Authenticated } from 'src/auth/authenticated.decorator';
import { UserDocument } from 'src/users/entities/user.entity';
import { Types } from 'mongoose';

@Controller('equipements')
export class EquipementsController {
  constructor(private readonly equipementsService: EquipementsService) {}

  @Post()
  create(@Body() createEquipementDto: CreateEquipmentDto, @Authenticated() user : UserDocument) {
    const gymId = new Types.ObjectId(createEquipementDto.gym);
    return this.equipementsService.create({...createEquipementDto, gym: gymId, createdBy: user._id});
  }

  @Get()
  findAll() {
    return this.equipementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipementsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEquipementDto: UpdateEquipementDto) {
    return this.equipementsService.update(id, updateEquipementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipementsService.remove(id);
  }
}
