# Budget Assistant AI Module

This module provides AI capabilities for the Budget Assistant application using LangGraph, LangChain, and OpenAI's GPT models.

## Features

- Natural language database querying
- Modular architecture with LangGraph for workflow management
- Clear separation of concerns with a tool-based approach

## Project Structure

The project is organized into the following modules:

- `main_langgraph.py` - Main entry point for the LangGraph-based implementation
- `tools/` - Contains tools for interacting with external systems
  - `db_tool.py` - Database querying tool using LangChain's SQL agent
- `state/` - Contains state management for the LangGraph workflow
  - `state.py` - Defines the state schema for the Budget Assistant
- `graph/` - Contains the LangGraph workflow definition
  - `nodes.py` - Defines the nodes for the LangGraph workflow
  - `graph.py` - Defines the graph structure and connections

## Setup

1. Create a Python virtual environment:

```bash
# Navigate to the ai directory
cd ai

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

2. Install the required dependencies:

```bash
pip install langchain langchain-openai langchain-community langgraph python-dotenv sqlalchemy psycopg2-binary
```

3. Set up your OpenAI API key and database connection:

```bash
# Copy the example .env file or create a new one
cp .env.example .env

# Edit the .env file and add your configuration
# OPENAI_API_KEY=your_api_key_here
# DB_HOST=localhost
# DB_PORT=5433
# DB_NAME=budget_assistant
# DB_USER=admin
# DB_PASSWORD=admin
```

## Usage

### Running the Budget Assistant

You can use the Budget Assistant AI with LangGraph:

```bash
python main_langgraph.py
```

### Using the BudgetAssistantAI Class

For programmatic usage, import the BudgetAssistantAI class:

```python
from main_langgraph import BudgetAssistantAI

# Create the Budget Assistant AI
budget_ai = BudgetAssistantAI(verbose=True)

# Query the database using natural language
response = budget_ai.query_prompt("What were my total expenses last month?")
print(f"Response: {response['output']}")

# Ask a general knowledge question
response = budget_ai.query_prompt("What is the capital of France?")
print(f"Response: {response['output']}")
```

## Integration with Backend

To integrate with the NestJS backend, you can create an API endpoint that communicates with this AI service. A simple approach is to use a REST API or direct Python execution from Node.js using child processes.

## Customization

You can customize the AI behavior by:

1. Adding new tools in the `tools/` directory
2. Modifying the graph workflow in `graph/graph.py`
3. Changing the OpenAI model or adjusting the temperature parameter
4. Extending the state schema in `state/state.py`
