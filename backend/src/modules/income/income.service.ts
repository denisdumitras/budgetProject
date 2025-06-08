import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from './entities/income.entity';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private incomeRepository: Repository<Income>,
  ) {}

  async create(createIncomeDto: CreateIncomeDto): Promise<Income> {
    const income = this.incomeRepository.create(createIncomeDto);
    return this.incomeRepository.save(income);
  }

  async findAll(): Promise<{ items: Income[]; count: number }> {
    const [items, count] = await this.incomeRepository.findAndCount();
    return { items, count };
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Income[]> {
    console.log('Income service - Date range request:', { startDate, endDate });
    
    // Parse dates and adjust to include full days
    const startDateObj = new Date(startDate);
    startDateObj.setHours(0, 0, 0, 0);
    
    const endDateObj = new Date(endDate);
    endDateObj.setHours(23, 59, 59, 999);
    
    // Format for database comparison (YYYY-MM-DD format)
    const formattedStartDate = startDateObj.toISOString().split('T')[0];
    const formattedEndDate = endDateObj.toISOString().split('T')[0] + ' 23:59:59.999';
    
    console.log('Income service - Using date range:', { formattedStartDate, formattedEndDate });
    
    // Use the between operator for date comparison
    return this.incomeRepository
      .createQueryBuilder('income')
      .where('DATE(income.date) >= DATE(:formattedStartDate)', { formattedStartDate })
      .andWhere('DATE(income.date) <= DATE(:formattedEndDate)', { formattedEndDate })
      .getMany();
  }

  async findOne(id: string): Promise<Income> {
    const income = await this.incomeRepository.findOne({ where: { id } });
    if (!income) {
      throw new NotFoundException(`Income with ID "${id}" not found`);
    }
    return income;
  }

  async update(id: string, updateIncomeDto: UpdateIncomeDto): Promise<Income> {
    const income = await this.findOne(id);
    Object.assign(income, updateIncomeDto);
    return this.incomeRepository.save(income);
  }

  async remove(id: string): Promise<void> {
    const result = await this.incomeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Income with ID "${id}" not found`);
    }
  }
}
