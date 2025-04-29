import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Post()
  create(@Body() createCompetitionDto: CreateCompetitionDto) {
    return this.competitionsService.create(createCompetitionDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.competitionsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.competitionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetitionDto: UpdateCompetitionDto) {
    return this.competitionsService.update(id, updateCompetitionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.competitionsService.remove(id);
  }
}
