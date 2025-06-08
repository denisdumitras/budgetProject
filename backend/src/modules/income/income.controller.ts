import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Controller('income')
@UseInterceptors(ClassSerializerInterceptor)
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto): Promise<Income> {
    return this.incomeService.create(createIncomeDto);
  }

  @Get()
  findAll(): Promise<{ items: Income[]; count: number }> {
    return this.incomeService.findAll();
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Income[]> {
    return this.incomeService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Income> {
    return this.incomeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ): Promise<Income> {
    return this.incomeService.update(id, updateIncomeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.incomeService.remove(id);
  }
}
