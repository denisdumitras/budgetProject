"""
LangGraph Graph Module

This module defines the graph for the Budget Assistant LangGraph.
"""

from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from state.state import BudgetAssistantState
from tools.db_tool import DatabaseTool
from graph.nodes import parse_query, query_database, general_knowledge, format_response


def create_budget_assistant_graph(
    llm: ChatOpenAI,
) -> StateGraph:
    """
    Create the graph for the Budget Assistant LangGraph.
    
    Args:
        llm: The language model
        db_tool: The database tool
        
    Returns:
        The graph
    """
    # Create the graph with a dictionary state type
    workflow = StateGraph(Dict)
    
    # Add the nodes to the graph
    workflow.add_node("parse_query", parse_query)
    workflow.add_node("query_database", query_database)
    workflow.add_node("general_knowledge", general_knowledge)
    workflow.add_node("format_response", format_response)
    
    # Define the conditional routing from parse_query
    def route_query(state):
        # Get the 'next' value from the dictionary returned by parse_query node
        # This will be either 'query_database' or 'general_knowledge'
        return state["next"]
    
    # Add conditional edges
    workflow.add_conditional_edges(
        "parse_query",
        route_query,
        {"query_database": "query_database", "general_knowledge": "general_knowledge"}
    )
    
    # Add the remaining edges
    workflow.add_edge("query_database", "format_response")
    workflow.add_edge("general_knowledge", END)
    workflow.add_edge("format_response", END)
    
    # Set the entry point
    workflow.set_entry_point("parse_query")
    
    # Compile the graph
    return workflow.compile()
