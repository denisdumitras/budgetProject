"""
Budget Assistant AI Module with Tool-Based Approach

This module provides AI capabilities for the Budget Assistant application,
using a tool-based approach with LangChain's AgentExecutor.
"""

import os
import sys
import logging
import traceback
from typing import Dict, Any, List
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor
from langchain.tools import Tool
from langchain.agents import create_tool_calling_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.schema import SystemMessage
from tools.db_tool import DatabaseTool
from tools.investment_tool import InvestmentTool

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("budget_assistant")


class BudgetAssistantAI:
    """
    Budget Assistant AI using a tool-based approach.

    This class provides a natural language interface to query financial data
    stored in a PostgreSQL database using LangChain's AgentExecutor.
    """

    def __init__(self, model_name: str = "gpt-4o", temperature: float = 0.4):
        """
        Initialize the Budget Assistant AI.

        Args:
            model_name: The name of the OpenAI model to use
            temperature: The temperature for the model
        """
        # Load environment variables
        load_dotenv()

        # Check if API key is available
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OPENAI_API_KEY environment variable is not set. Please create a .env file with your API key.")

        logger.info(f"Initializing LLM with model: {model_name}")
        # Initialize the LLM
        self.llm = ChatOpenAI(
            model_name=model_name,
            temperature=temperature
        )

        # Initialize tools
        logger.info("Initializing tools")
        self.tools = self._initialize_tools()

        # Create the agent
        logger.info("Creating agent")
        self.agent_executor = self._create_agent()

    def _initialize_tools(self) -> List[Tool]:
        """
        Initialize the tools for the agent.

        Returns:
            List[Tool]: The tools for the agent
        """
        # Initialize the database tool
        db_tool = DatabaseTool(self.llm)

        # Initialize the investment tool
        investment_tool = InvestmentTool()

        # Create tools
        tools = [
            Tool.from_function(
                func=db_tool.query_database,
                name="query_financial_database",
                description="""Use this tool to query the user's financial database for information about expenses, income, and investments.
                This tool can translate natural language questions into SQL and retrieve data from the database.
                Examples:
                - "What were my expenses last month?"
                - "How much did I spend on groceries in 2023?"
                - "What is my average monthly income?"
                - "Show me my investment portfolio"""
            ),
            Tool.from_function(
                func=investment_tool.get_apple_stock_data,
                name="get_apple_stock_data",
                description="""Use this tool to get current Apple stock data including price, daily change percentage, and weekly performance.
                This is useful when the user asks about Apple stock or wants to know about their Apple investment.
                Examples:
                - "How is Apple stock doing?"
                - "What's the current price of Apple shares?"
                - "Has Apple stock gone up or down this week?"""
            )
        ]

        return tools

    def _create_agent(self) -> AgentExecutor:
        """
        Create the agent executor.

        Returns:
            AgentExecutor: The agent executor
        """
        # Create a conversation memory
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )

        # Create the system message
        system_message = """You are a helpful financial assistant that can answer questions about the user's personal finances.
        You have access to the user's financial database which contains information about their expenses, income, and investments.
        You can also provide information about Apple stock performance.

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

        If you don't know the answer to a question, say so. Do not make up information."""

        # Create the prompt
        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=system_message),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad")
        ])

        # Create the agent
        agent = create_tool_calling_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )

        # Create the agent executor
        agent_executor = AgentExecutor(
            agent=agent,
            tools=self.tools,
            memory=memory,
            verbose=True,
            handle_parsing_errors=True
        )

        return agent_executor

    def query_prompt(self, query: str) -> Dict[str, Any]:
        """
        Process a natural language query using the agent.

        Args:
            query: The natural language query

        Returns:
            A dictionary containing the response
        """
        try:
            logger.info(f"Processing query: {query}")

            # Run the agent with the query
            result = self.agent_executor.invoke({"input": query})
            logger.info("Agent execution completed successfully")

            # Return the final response
            return {"output": result["output"]}
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return {"error": str(e), "output": f"Error processing query: {str(e)}"}


def run_test_cases():
    """
    Run test cases for the Budget Assistant AI.
    """
    # Initialize the Budget Assistant AI
    logger.info("Initializing Budget Assistant AI")
    try:
        budget_assistant = BudgetAssistantAI()

        # Test cases
        test_cases = [
            {
                "name": "General Knowledge Query",
                "query": "What is the current value of all my investments ?"
            }
        ]

        # Run the test cases
        for test_case in test_cases:
            logger.info(f"Running test case: {test_case['name']}")
            print(f"\n--- Test Case: {test_case['name']} ---")
            print(f"Input: {test_case['query']}")
            response = budget_assistant.query_prompt(test_case['query'])
            print(f"Response: {response.get('output', response.get('error', 'No response'))}")
    except Exception as e:
        logger.error(f"Error running test cases: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        print(f"Error running test cases: {str(e)}")


if __name__ == "__main__":
    print("Starting Budget Assistant AI test cases...")
    run_test_cases()
    print("Test cases completed.")
