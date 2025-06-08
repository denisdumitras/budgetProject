"""
Database Tool Module

This module provides a tool for querying the PostgreSQL database using natural language.
"""

import os
from typing import Dict, Any
from sqlalchemy import create_engine
from langchain_community.utilities import SQLDatabase
from langchain_openai import ChatOpenAI
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit


class DatabaseTool:
    """
    Tool for querying the PostgreSQL database using natural language.
    
    This class provides a simple interface to query a PostgreSQL database
    using natural language. It uses LangChain's SQL agent to translate
    natural language queries into SQL and execute them.
    """
    
    # SQL Agent prompt template
    AGENT_PREFIX = """You are an AI assistant with expertise in personal finance. You have access to a PostgreSQL database
    containing the user's financial data across three specific tables: 'expense', 'income', and 'investment'.

    Your primary goal is to accurately answer the user's questions about their financial data.
    
    When analyzing financial data:
    - For expenses: Focus on categories, amounts, dates, and patterns
    - For income: Look at sources, frequency, and trends
    - For investments: Consider performance, allocation, and growth
    
    Always format currency values properly with the appropriate symbol.
    Present numerical data in a clear, readable format.
    When showing date ranges or time periods, be specific about the timeframe.
    
    If you need to perform calculations:
    - Be precise with mathematical operations
    - Show your reasoning when appropriate
    - Round monetary values to two decimal places
    
    You have access to tools that can list tables, get table schemas, and execute SQL queries.
    """
    
    def __init__(self, llm: ChatOpenAI):
        """
        Initialize the Database Tool.
        
        Args:
            llm: The language model to use for the SQL agent
        """
        # Connect to the database
        self.db = self._connect_to_database()
        
        # Create SQL toolkit and agent
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=llm)
        self.agent = self._create_sql_agent(llm)
    
    def _connect_to_database(self) -> SQLDatabase:
        """
        Connect to the PostgreSQL database.
        
        Returns:
            SQLDatabase: The connected database
        """
        # Load database connection parameters from environment variables
        db_host = os.getenv("DB_HOST", "localhost")
        db_port = os.getenv("DB_PORT", "5433")  # Using 5433 to avoid conflicts with local PostgreSQL
        db_name = os.getenv("DB_NAME", "budget_assistant")
        db_user = os.getenv("DB_USER", "admin")
        db_password = os.getenv("DB_PASSWORD", "admin")
        
        # Create the database connection string
        db_uri = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        
        try:
            # Create the SQLAlchemy engine
            engine = create_engine(db_uri)
            
            # Create the SQLDatabase object
            db = SQLDatabase.from_uri(db_uri)
            
            print("Successfully connected to database")
            print(f"Available tables: {db.get_table_names()}")
            
            return db
        except Exception as e:
            raise ConnectionError(f"Failed to connect to database: {e}")
    
    def _create_sql_agent(self, llm: ChatOpenAI):
        """
        Create a SQL agent for database queries.
        
        Args:
            llm: The language model to use for the SQL agent
            
        Returns:
            The SQL agent
        """
        # Create the SQL agent using the recommended approach
        agent = create_sql_agent(
            llm=llm,
            db=self.db,
            verbose=True,
            agent_type="tool-calling",  # Use string instead of enum
            prefix=self.AGENT_PREFIX
        )
        
        return agent
    
    def query_database(self, query: str) -> Dict[str, Any]:
        """
        Query the database using natural language.
        
        Args:
            query: The natural language query
            
        Returns:
            Dict: The agent's response
        """
        try:
            # Run the agent with the query
            result = self.agent.invoke({"input": query})
            
            # Return the result
            return {"output": result["output"]}
        except Exception as e:
            return {"error": str(e), "output": f"Error querying database: {e}"}
