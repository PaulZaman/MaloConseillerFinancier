// Info tooltips pour chaque classe d'actifs
export const assetInfo = {
  'Obligations': 'Titres de créance émis par des États ou entreprises. Faible risque, rendement stable.',
  'ETF Actions': 'Fonds négociés en bourse qui suivent des indices boursiers. Risque moyen à élevé.',
  'Cash': 'Liquidités et comptes d\'épargne. Aucun risque, faible rendement.',
  'Immobilier/REIT': 'Fonds d\'investissement immobilier. Diversification et revenus réguliers.',
  'Crypto': 'Cryptomonnaies comme Bitcoin, Ethereum. Très haute volatilité et risque élevé.'
}

// Rendements annuels moyens estimés par classe d'actifs (%)
export const expectedReturns = {
  'Obligations': 3,
  'ETF Actions': 8,
  'Cash': 1,
  'Immobilier/REIT': 6,
  'Crypto': 15
}

// Volatilité par classe d'actifs (écart-type annuel)
export const assetVolatility = {
  'Obligations': 0.05,
  'ETF Actions': 0.18,
  'Cash': 0.01,
  'Immobilier/REIT': 0.12,
  'Crypto': 0.60
}

// Couleurs pour les graphiques
export const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
