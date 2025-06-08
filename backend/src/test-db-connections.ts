import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { databaseConfig } from './config/database.config';

// Database configuration
const dbConfig = databaseConfig as PostgresConnectionOptions;

// Create a new data source instance
const testDataSource = new DataSource(dbConfig);

// Function to test database connection
async function testConnection() {
  try {
    // Initialize the data source
    await testDataSource.initialize();
    console.log('✅ Database connection has been established successfully.');

    // Close the connection
    await testDataSource.destroy();
    console.log('👋 Connection closed.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    console.error('Error details:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run the test
testConnection();
