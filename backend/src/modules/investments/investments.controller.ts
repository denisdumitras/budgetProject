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
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { Investment } from './entities/investment.entity';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Controller('investments')
@UseInterceptors(ClassSerializerInterceptor)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  create(@Body() createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
    return this.investmentsService.create(createInvestmentDto);
  }

  @Get()
  findAll(): Promise<{ items: Investment[]; count: number }> {
    return this.investmentsService.findAll();
  }

  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Investment[]> {
    return this.investmentsService.findByDateRange(startDate, endDate);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Investment> {
    return this.investmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<Investment> {
    return this.investmentsService.update(id, updateInvestmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.investmentsService.remove(id);
  }
}
