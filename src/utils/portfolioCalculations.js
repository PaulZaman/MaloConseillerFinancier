import { expectedReturns, assetVolatility } from '../constants/assetInfo'

export const choisirProfil = (capital, risque) => {
  const profils = {
    faible: {
      sécuritaire: { Obligations: 50, 'ETF Actions': 25, Cash: 20, 'Immobilier/REIT': 5, Crypto: 0 },
      équilibré: { Obligations: 35, 'ETF Actions': 40, Cash: 20, 'Immobilier/REIT': 5, Crypto: 0 },
    },
    élevée: {
      équilibré: { Obligations: 20, 'ETF Actions': 60, Cash: 15, 'Immobilier/REIT': 5, Crypto: 0 },
      dynamique: { Obligations: 10, 'ETF Actions': 70, Cash: 10, 'Immobilier/REIT': 5, Crypto: 5 },
    },
  }

  if (capital < 2000) {
    if (risque === 'élevée') {
      return {
        allocation: profils.faible.équilibré,
        justification: 'Capital < 2 000€ : profil prudent (limitation de la volatilité).',
      }
    } else {
      return {
        allocation: profils.faible.sécuritaire,
        justification: 'Capital < 2 000€ : profil sécuritaire.',
      }
    }
  } else if (capital >= 2000 && capital < 10000) {
    if (risque === 'élevée') {
      return {
        allocation: profils.élevée.équilibré,
        justification: 'Capital 2 000–10 000€ : profil équilibré orienté croissance.',
      }
    } else {
      return {
        allocation: profils.faible.équilibré,
        justification: 'Capital 2 000–10 000€ : profil équilibré prudent.',
      }
    }
  } else {
    if (risque === 'élevée') {
      return {
        allocation: profils.élevée.dynamique,
        justification: 'Capital ≥ 10 000€ : profil dynamique (diversification + croissance).',
      }
    } else {
      return {
        allocation: profils.faible.équilibré,
        justification: 'Capital ≥ 10 000€ : profil équilibré (risque maîtrisé).',
      }
    }
  }
}

export const calculateProjection = (result, years) => {
  if (!result) return []
  
  // Calculate weighted average return
  let weightedReturn = 0
  let portfolioVolatility = 0
  
  Object.entries(result.allocation).forEach(([asset, percentage]) => {
    weightedReturn += (percentage / 100) * (expectedReturns[asset] / 100)
    portfolioVolatility += (percentage / 100) * assetVolatility[asset]
  })
  
  // Convert annual metrics to daily
  const tradingDaysPerYear = 252
  const totalDays = years * tradingDaysPerYear
  const dailyReturn = weightedReturn / tradingDaysPerYear
  const dailyVolatility = portfolioVolatility / Math.sqrt(tradingDaysPerYear)
  
  // Calculate target final value
  const targetFinalValue = result.capital * Math.pow(1 + weightedReturn, years)
  
  // Generate daily values with mean-reverting volatility
  const dailyValues = [result.capital]
  let currentValue = result.capital
  let cumulativeDeviation = 0 // Track cumulative deviation from expected path
  
  for (let day = 1; day <= totalDays; day++) {
    // Expected value at this point (linear growth)
    const expectedValue = result.capital * (1 + (weightedReturn * day / tradingDaysPerYear / years))
    
    // Mean reversion force: pull back towards expected path
    const meanReversionStrength = 0.02
    const deviationFromExpected = (currentValue - expectedValue) / expectedValue
    const meanReversionAdjustment = -deviationFromExpected * meanReversionStrength
    
    // Random daily return with normal distribution (Box-Muller transform)
    const u1 = Math.random()
    const u2 = Math.random()
    const normalRandom = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const randomDailyReturn = normalRandom * dailyVolatility
    
    // Combine mean reversion with random walk
    const totalDailyReturn = dailyReturn + randomDailyReturn + meanReversionAdjustment
    
    currentValue = currentValue * (1 + totalDailyReturn)
    dailyValues.push(currentValue)
  }
  
  // Fine adjustment to hit exact target
  const actualFinalValue = dailyValues[totalDays]
  const adjustmentFactor = targetFinalValue / actualFinalValue
  
  // Sample data points for display (weekly for better performance and readability)
  const projectionData = []
  const samplingInterval = 5 // Every 5 days (weekly)
  
  for (let day = 0; day <= totalDays; day += samplingInterval) {
    const adjustedValue = dailyValues[day] * Math.pow(adjustmentFactor, day / totalDays)
    const yearFraction = day / tradingDaysPerYear
    
    projectionData.push({ 
      year: Math.round(yearFraction * 10) / 10, // Round to 1 decimal
      value: Math.round(adjustedValue * 100) / 100,
      baseline: Math.round(result.capital * Math.pow(1 + weightedReturn, yearFraction) * 100) / 100
    })
  }
  
  // Add final point to ensure we show the exact end value
  if (projectionData[projectionData.length - 1].year !== years) {
    const adjustedValue = dailyValues[totalDays] * adjustmentFactor
    projectionData.push({ 
      year: years,
      value: Math.round(adjustedValue * 100) / 100,
      baseline: Math.round(result.capital * Math.pow(1 + weightedReturn, years) * 100) / 100
    })
  }
  
  return projectionData
}

export const calculateCrisisProjection = (result, years) => {
  if (!result) return []
  
  // Calculate weighted average return
  let weightedReturn = 0
  let portfolioVolatility = 0
  
  Object.entries(result.allocation).forEach(([asset, percentage]) => {
    weightedReturn += (percentage / 100) * (expectedReturns[asset] / 100)
    portfolioVolatility += (percentage / 100) * assetVolatility[asset]
  })
  
  // Convert to daily metrics
  const tradingDaysPerYear = 252
  const totalDays = years * tradingDaysPerYear
  const dailyReturn = weightedReturn / tradingDaysPerYear
  const dailyVolatility = portfolioVolatility / Math.sqrt(tradingDaysPerYear)
  
  // Define crisis events (in days)
  const crises = [
    { 
      day: Math.floor(totalDays * 0.3), 
      dropPerDay: 0.05, // 5% per day for 5 days
      duration: 5,
      recovery: tradingDaysPerYear * 3 // 3 years recovery
    },
    { 
      day: Math.floor(totalDays * 0.7), 
      dropPerDay: 0.03,
      duration: 5,
      recovery: tradingDaysPerYear * 2 // 2 years recovery
    },
  ].filter(crisis => crisis.day < totalDays && crisis.day > 0)
  
  // Calculate target final value
  const targetFinalValue = result.capital * Math.pow(1 + weightedReturn, years)
  
  // Generate daily values with crises
  const dailyValues = [result.capital]
  let currentValue = result.capital
  
  for (let day = 1; day <= totalDays; day++) {
    // Check if we're in a crisis period
    const activeCrisis = crises.find(c => 
      day >= c.day && day < c.day + c.duration
    )
    
    if (activeCrisis) {
      // Crisis: daily drops
      currentValue = currentValue * (1 - activeCrisis.dropPerDay)
    } else {
      // Check if we're in recovery period
      const inRecovery = crises.find(c => 
        day >= c.day + c.duration && day < c.day + c.duration + c.recovery
      )
      
      if (inRecovery) {
        // Enhanced daily recovery
        const recoveryBoost = 1.5
        const enhancedDailyReturn = dailyReturn * recoveryBoost
        const u1 = Math.random()
        const u2 = Math.random()
        const normalRandom = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
        const randomReturn = normalRandom * dailyVolatility * 0.5 // Reduced volatility during recovery
        
        currentValue = currentValue * (1 + enhancedDailyReturn + randomReturn)
      } else {
        // Normal growth with volatility
        const u1 = Math.random()
        const u2 = Math.random()
        const normalRandom = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
        const randomReturn = normalRandom * dailyVolatility
        
        currentValue = currentValue * (1 + dailyReturn + randomReturn)
      }
    }
    
    dailyValues.push(currentValue)
  }
  
  // Adjust to reach target
  const actualFinalValue = dailyValues[totalDays]
  const adjustmentFactor = targetFinalValue / actualFinalValue
  
  // Sample data points for display (weekly)
  const projectionData = []
  const samplingInterval = 5 // Every 5 days
  
  for (let day = 0; day <= totalDays; day += samplingInterval) {
    const adjustedValue = dailyValues[day] * Math.pow(adjustmentFactor, day / totalDays)
    const yearFraction = day / tradingDaysPerYear
    
    projectionData.push({ 
      year: Math.round(yearFraction * 10) / 10,
      value: Math.round(adjustedValue * 100) / 100,
      baseline: Math.round(result.capital * Math.pow(1 + weightedReturn, yearFraction) * 100) / 100
    })
  }
  
  // Add final point
  if (projectionData[projectionData.length - 1].year !== years) {
    const adjustedValue = dailyValues[totalDays] * adjustmentFactor
    projectionData.push({ 
      year: years,
      value: Math.round(adjustedValue * 100) / 100,
      baseline: Math.round(result.capital * Math.pow(1 + weightedReturn, years) * 100) / 100
    })
  }
  
  return projectionData
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value)
}
