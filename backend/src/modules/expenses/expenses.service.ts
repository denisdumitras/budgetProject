import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expenses.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expensesRepository.create(createExpenseDto);
    return this.expensesRepository.save(expense);
  }

  async findAll(): Promise<{ items: Expense[]; count: number }> {
    const [items, count] = await this.expensesRepository.findAndCount();
    return { items, count };
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<Expense[]> {
    console.log('Expenses service - Date range request:', { startDate, endDate });
    
    // Parse dates and adjust to include full days
    const startDateObj = new Date(startDate);
    startDateObj.setHours(0, 0, 0, 0);
    
    const endDateObj = new Date(endDate);
    endDateObj.setHours(23, 59, 59, 999);
    
    // Format for database comparison (YYYY-MM-DD format)
    const formattedStartDate = startDateObj.toISOString().split('T')[0];
    const formattedEndDate = endDateObj.toISOString().split('T')[0] + ' 23:59:59.999';
    
    console.log('Expenses service - Using date range:', { formattedStartDate, formattedEndDate });
    
    // Use the between operator for date comparison
    return this.expensesRepository
      .createQueryBuilder('expense')
      .where('DATE(expense.date) >= DATE(:formattedStartDate)', { formattedStartDate })
      .andWhere('DATE(expense.date) <= DATE(:formattedEndDate)', { formattedEndDate })
      .getMany();
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Expense with ID "${id}" not found`);
    }
    return expense;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOne(id);
    Object.assign(expense, updateExpenseDto);
    return this.expensesRepository.save(expense);
  }

  async remove(id: string): Promise<void> {
    const result = await this.expensesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Expense with ID "${id}" not found`);
    }
  }
}
