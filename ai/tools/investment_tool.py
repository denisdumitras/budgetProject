"""
Simplified Investment Tool Module

This module provides basic Apple stock data retrieval using Yahoo Finance API.
"""

import datetime
from typing import Dict, Any, Union
import yfinance as yf


class InvestmentTool:
    """
    Simple class for retrieving Apple stock data.
    """
    
    def __init__(self):
        """Initialize the Investment Tool."""
        pass
    
    def get_apple_stock_data(self, query: Union[str, Dict[str, dict]]) -> Dict[str, Any]:
        """
        Get real-time Apple stock data from Yahoo Finance.
        
        Returns:
            Dict: Apple stock data including current price and daily change
        """
        try:
            # Get Apple stock information
            stock = yf.Ticker("AAPL")
            
            # Get current data
            current_data = stock.info
            
            # Get historical data (last 7 days)
            hist = stock.history(period="7d")
            
            # Calculate some basic metrics
            if not hist.empty:
                start_price = hist['Close'].iloc[0]
                current_price = hist['Close'].iloc[-1]
                week_change_pct = ((current_price - start_price) / start_price) * 100
            else:
                start_price = None
                current_price = None
                week_change_pct = None
            
            # Create a simplified response with the most relevant information
            response = {
                "name": current_data.get("shortName", "Apple Inc."),
                "current_price": current_data.get("currentPrice", current_data.get("regularMarketPrice")),
                "currency": current_data.get("currency", "USD"),
                "day_change_percent": current_data.get("regularMarketChangePercent"),
                "week_change_percent": week_change_pct,
                "timestamp": datetime.datetime.now().isoformat()
            }
            
            return {"success": True, "data": response}
            
        except Exception as e:
            return {"success": False, "error": str(e), "output": f"Error retrieving Apple stock data: {e}"}
