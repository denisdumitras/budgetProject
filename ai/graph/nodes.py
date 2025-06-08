"""
LangGraph Nodes Module

This module defines the nodes for the Budget Assistant LangGraph.
"""

from typing import Dict, Any, Tuple, Annotated, TypedDict, List
from langchain_core.messages import HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from state.state import BudgetAssistantState
from tools.db_tool import DatabaseTool


class ParseOutput(TypedDict):
    state: BudgetAssistantState
    next: str


def parse_query(inputs: Dict[str, Any]) -> ParseOutput:
    """
    Parse the user query and determine if it requires database access.
    
    Args:
        inputs: Dictionary containing state and other inputs
        
    Returns:
        Dictionary with updated state and routing information
    """
    state = inputs["state"]
    llm = inputs["llm"]
    
    # Add the user query to the conversation history
    state.conversation_history.append({"role": "user", "content": state.query})
    
    # Use the LLM to determine if the query requires database access
    messages = [
        HumanMessage(content=f"""
        Determine if the following query requires access to the user's financial database:
        
        Query: {state.query}
        
        Respond with only 'YES' if the query is specifically about the user's personal financial data 
        that would be stored in the 'expense', 'income', or 'investment' tables.
        
        Respond with only 'NO' if the query is general knowledge or does not relate to the user's 
        financial data stored in these specific tables.
        """)
    ]
    
    response = llm.invoke(messages)
    requires_db = response.content.strip().upper() == "YES"
    
    # If the query requires database access, we'll route to the database node
    # Otherwise, we'll route to the general knowledge node
    next_node = "query_database" if requires_db else "general_knowledge"
    
    # Return the state and routing information
    return {"state": state, "next": next_node}


def query_database(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Query the database using the user's query.
    
    Args:
        inputs: Dictionary containing state and other inputs
        
    Returns:
        Dictionary with updated state
    """
    state = inputs["state"]
    db_tool = inputs["db_tool"]
    
    try:
        # Query the database
        db_response = db_tool.query_database(state.query)
        state.db_response = db_response
        return {"state": state}
    except Exception as e:
        state.error = str(e)
        return {"state": state}


def general_knowledge(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle general knowledge queries that don't require database access.
    
    Args:
        inputs: Dictionary containing state and other inputs
        
    Returns:
        Dictionary with updated state
    """
    state = inputs["state"]
    llm = inputs["llm"]
    
    # Create a prompt for the LLM
    messages = [
        HumanMessage(content=f"""
        Answer the following question using your general knowledge. 
        This question does not require access to the user's financial database.
        
        Question: {state.query}
        """)
    ]
    
    # Get the response from the LLM
    response = llm.invoke(messages)
    
    # Set the final response
    state.final_response = response.content
    
    # Add the response to the conversation history
    state.conversation_history.append({"role": "assistant", "content": state.final_response})
    
    return {"state": state}


def format_response(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """
    Format the response from the database query.
    
    Args:
        inputs: Dictionary containing state and other inputs
        
    Returns:
        Dictionary with updated state
    """
    state = inputs["state"]
    
    if state.error:
        # If there was an error, return an error message
        state.final_response = f"I encountered an error while processing your query: {state.error}"
    elif state.db_response:
        # If we have a database response, format it
        state.final_response = state.db_response.get("output", "No response from database")
    
    # Add the response to the conversation history
    state.conversation_history.append({"role": "assistant", "content": state.final_response})
    
    return {"state": state}
