"""
State Management Module

This module defines the state schema for the Budget Assistant LangGraph.
"""

from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field


class BudgetAssistantState(BaseModel):
    """
    State schema for the Budget Assistant LangGraph.
    
    This class defines the state that is passed between nodes in the LangGraph.
    It includes the user's query, conversation history, database response,
    final response, and any errors that occurred during processing.
    """
    
    # The user's query
    query: str = Field(description="The user's query")
    
    # The conversation history
    conversation_history: List[Dict[str, str]] = Field(
        default_factory=list,
        description="The conversation history between the user and the assistant"
    )
    
    # Whether the query requires database access
    requires_db: Optional[bool] = Field(
        default=None,
        description="Whether the query requires database access"
    )
    
    # The database response
    db_response: Optional[Dict[str, Any]] = Field(
        default=None,
        description="The response from the database query"
    )
    
    # The final response to the user
    final_response: Optional[str] = Field(
        default=None,
        description="The final response to the user"
    )
    
    # Any error that occurred during processing
    error: Optional[str] = Field(
        default=None,
        description="Any error that occurred during processing"
    )
