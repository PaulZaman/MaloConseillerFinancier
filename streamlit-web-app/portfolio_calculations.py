"""
Portfolio calculation and projection utilities
"""
import numpy as np
from asset_info import expected_returns, asset_volatility


def choisir_profil(capital, risque):
    """
    Choose investment profile based on capital and risk tolerance
    """
    profils = {
        'faible': {
            'sécuritaire': {'Obligations': 50, 'ETF Actions': 25, 'Cash': 20, 'Immobilier/REIT': 5, 'Crypto': 0},
            'équilibré': {'Obligations': 35, 'ETF Actions': 40, 'Cash': 20, 'Immobilier/REIT': 5, 'Crypto': 0},
        },
        'élevée': {
            'équilibré': {'Obligations': 20, 'ETF Actions': 60, 'Cash': 15, 'Immobilier/REIT': 5, 'Crypto': 0},
            'dynamique': {'Obligations': 10, 'ETF Actions': 70, 'Cash': 10, 'Immobilier/REIT': 5, 'Crypto': 5},
        },
    }

    if capital < 2000:
        if risque == 'élevée':
            return {
                'allocation': profils['faible']['équilibré'],
                'justification': 'Capital < 2 000€ : profil prudent (limitation de la volatilité).',
            }
        else:
            return {
                'allocation': profils['faible']['sécuritaire'],
                'justification': 'Capital < 2 000€ : profil sécuritaire.',
            }
    elif 2000 <= capital < 10000:
        if risque == 'élevée':
            return {
                'allocation': profils['élevée']['équilibré'],
                'justification': 'Capital 2 000–10 000€ : profil équilibré orienté croissance.',
            }
        else:
            return {
                'allocation': profils['faible']['équilibré'],
                'justification': 'Capital 2 000–10 000€ : profil équilibré prudent.',
            }
    else:
        if risque == 'élevée':
            return {
                'allocation': profils['élevée']['dynamique'],
                'justification': 'Capital ≥ 10 000€ : profil dynamique (diversification + croissance).',
            }
        else:
            return {
                'allocation': profils['faible']['équilibré'],
                'justification': 'Capital ≥ 10 000€ : profil équilibré (risque maîtrisé).',
            }


def calculate_projection(allocation, capital, years):
    """
    Calculate portfolio projection with daily volatility
    """
    # Calculate weighted average return and volatility
    weighted_return = 0
    portfolio_volatility = 0
    
    for asset, percentage in allocation.items():
        weighted_return += (percentage / 100) * (expected_returns[asset] / 100)
        portfolio_volatility += (percentage / 100) * asset_volatility[asset]
    
    # Convert annual metrics to daily
    trading_days_per_year = 252
    total_days = years * trading_days_per_year
    daily_return = weighted_return / trading_days_per_year
    daily_volatility = portfolio_volatility / np.sqrt(trading_days_per_year)
    
    # Generate daily values with mean-reverting volatility
    daily_values = [capital]
    current_value = capital
    
    for day in range(1, total_days + 1):
        # Expected value at this point (linear growth)
        expected_value = capital * (1 + (weighted_return * day / trading_days_per_year / years))
        
        # Mean reversion force: pull back towards expected path
        mean_reversion_strength = 0.02
        deviation_from_expected = (current_value - expected_value) / expected_value if expected_value != 0 else 0
        mean_reversion_adjustment = -deviation_from_expected * mean_reversion_strength
        
        # Random daily return with normal distribution
        random_daily_return = np.random.normal(0, daily_volatility)
        
        # Combine mean reversion with random walk
        total_daily_return = daily_return + random_daily_return + mean_reversion_adjustment
        
        current_value = current_value * (1 + total_daily_return)
        daily_values.append(current_value)
    
    # Sample data points for visualization (one per year)
    projection_data = []
    baseline_data = []
    
    for year in range(years + 1):
        day_index = year * trading_days_per_year
        if day_index >= len(daily_values):
            day_index = len(daily_values) - 1
        
        projection_data.append({
            'year': year,
            'value': daily_values[day_index]
        })
        
        # Baseline (smooth exponential growth)
        baseline_value = capital * (1 + weighted_return) ** year
        baseline_data.append({
            'year': year,
            'baseline': baseline_value
        })
    
    return projection_data, baseline_data, portfolio_volatility


def format_currency(value):
    """Format value as currency"""
    return f"{value:,.2f} €".replace(",", " ")
