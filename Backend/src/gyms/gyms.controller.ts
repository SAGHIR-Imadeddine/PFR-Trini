import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { CreateGymDto } from './dto/create-gym.dto';
import { UpdateGymDto } from './dto/update-gym.dto';
import { Authenticated } from 'src/auth/authenticated.decorator';
import { UserDocument } from 'src/users/entities/user.entity';
import { Public } from 'src/auth/public.decorator';

@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}


  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.gymsService.findOne(id);
  }

  @Get()
  @Public()
  findAll() {
    return this.gymsService.findAll();
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGymDto: UpdateGymDto) {
    return this.gymsService.update(id, updateGymDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gymsService.remove(id);
  }

  
  @Post()
  create(@Body() createGymDto: CreateGymDto, @Authenticated() user: UserDocument) {
    return this.gymsService.create(createGymDto, user);
  }

}
