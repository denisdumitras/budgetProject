import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
    const investment = this.investmentsRepository.create(createInvestmentDto);
    return this.investmentsRepository.save(investment);
  }

  async findAll(): Promise<{ items: Investment[]; count: number }> {
    const [items, count] = await this.investmentsRepository.findAndCount();
    return { items, count };
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Investment[]> {
    console.log('Investments service - Date range request:', { startDate, endDate });
    
    // Parse dates and adjust to include full days
    const startDateObj = new Date(startDate);
    startDateObj.setHours(0, 0, 0, 0);
    
    const endDateObj = new Date(endDate);
    endDateObj.setHours(23, 59, 59, 999);
    
    // Format for database comparison (YYYY-MM-DD format)
    const formattedStartDate = startDateObj.toISOString().split('T')[0];
    const formattedEndDate = endDateObj.toISOString().split('T')[0] + ' 23:59:59.999';
    
    console.log('Investments service - Using date range:', { formattedStartDate, formattedEndDate });
    
    // Use the between operator for date comparison
    return this.investmentsRepository
      .createQueryBuilder('investment')
      .where('DATE(investment.date) >= DATE(:formattedStartDate)', { formattedStartDate })
      .andWhere('DATE(investment.date) <= DATE(:formattedEndDate)', { formattedEndDate })
      .getMany();
  }

  async findOne(id: string): Promise<Investment> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
    });
    if (!investment) {
      throw new NotFoundException(`Investment with ID "${id}" not found`);
    }
    return investment;
  }

  async update(
    id: string,
    updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<Investment> {
    const investment = await this.findOne(id);
    Object.assign(investment, updateInvestmentDto);
    return this.investmentsRepository.save(investment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.investmentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Investment with ID "${id}" not found`);
    }
  }
}
