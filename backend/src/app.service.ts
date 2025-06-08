import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testDatabaseConnection(): Promise<{ status: string; message: string }> {
    try {
      // Check if the connection is established
      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize();
      }

      // Run a simple query to test the connection
      await this.dataSource.query('SELECT 1');

      return {
        status: 'success',
        message: 'Successfully connected to PostgreSQL database',
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Failed to connect to database: ${error.message}`,
      };
    }
  }
}
