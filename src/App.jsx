import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

// Info tooltips pour chaque classe d'actifs
const assetInfo = {
  'Obligations': 'Titres de créance émis par des États ou entreprises. Faible risque, rendement stable.',
  'ETF Actions': 'Fonds négociés en bourse qui suivent des indices boursiers. Risque moyen à élevé.',
  'Cash': 'Liquidités et comptes d\'épargne. Aucun risque, faible rendement.',
  'Immobilier/REIT': 'Fonds d\'investissement immobilier. Diversification et revenus réguliers.',
  'Crypto': 'Cryptomonnaies comme Bitcoin, Ethereum. Très haute volatilité et risque élevé.'
}

// Rendements annuels moyens estimés par classe d'actifs (%)
const expectedReturns = {
  'Obligations': 3,
  'ETF Actions': 8,
  'Cash': 1,
  'Immobilier/REIT': 6,
  'Crypto': 15
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

function App() {
  const [capital, setCapital] = useState('')
  const [risque, setRisque] = useState('faible')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [years, setYears] = useState(10)
  const [showProjection, setShowProjection] = useState(false)
  const [hoveredAsset, setHoveredAsset] = useState(null)

  // Toggle dark mode on body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const choisirProfil = (capital, risque) => {
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

  const calculateProjection = () => {
    if (!result) return []
    
    const projectionData = []
    let totalValue = result.capital
    
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        projectionData.push({ year, value: totalValue })
        continue
      }
      
      // Calculate weighted average return
      let weightedReturn = 0
      Object.entries(result.allocation).forEach(([asset, percentage]) => {
        weightedReturn += (percentage / 100) * (expectedReturns[asset] / 100)
      })
      
      totalValue = totalValue * (1 + weightedReturn)
      projectionData.push({ 
        year, 
        value: Math.round(totalValue * 100) / 100 
      })
    }
    
    return projectionData
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setShowProjection(false)

    const capitalValue = parseFloat(capital.replace(',', '.'))

    if (isNaN(capitalValue) || capitalValue <= 0) {
      setError('Le capital doit être un nombre supérieur à 0.')
      return
    }

    const recommendation = choisirProfil(capitalValue, risque)
    setResult({
      capital: capitalValue,
      ...recommendation,
    })
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value)
  }

  const getPieChartData = () => {
    if (!result) return []
    return Object.entries(result.allocation)
      .filter(([_, pct]) => pct > 0)
      .map(([name, value]) => ({ name, value }))
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    } py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              💰 Conseiller en Investissement
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Outil de décision pédagogique
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all shadow-lg ${
              darkMode 
                ? 'bg-yellow-400 hover:bg-yellow-300 text-gray-900' 
                : 'bg-gray-800 hover:bg-gray-700 text-yellow-300'
            }`}
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Form Section */}
        <div className={`rounded-lg shadow-xl p-8 mb-8 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="capital" className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Capital à investir (en €)
              </label>
              <input
                type="text"
                id="capital"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                placeholder="Ex: 5000 ou 5000.50"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Tolérance au risque
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRisque('faible')}
                  className={`py-3 px-6 rounded-lg font-medium transition ${
                    risque === 'faible'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🛡️ Faible
                </button>
                <button
                  type="button"
                  onClick={() => setRisque('élevée')}
                  className={`py-3 px-6 rounded-lg font-medium transition ${
                    risque === 'élevée'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📈 Élevée
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
            >
              Obtenir ma recommandation
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className={`rounded-lg shadow-xl p-8 animate-fade-in ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              📊 Recommandation d'investissement
            </h2>

            <div className={`border rounded-lg p-4 mb-6 ${
              darkMode 
                ? 'bg-indigo-900/30 border-indigo-800' 
                : 'bg-indigo-50 border-indigo-200'
            }`}>
              <p className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>
                Capital: {formatCurrency(result.capital)}
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
                {result.justification}
              </p>
            </div>

            {/* Pie Chart */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                📈 Répartition visuelle:
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getPieChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getPieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#374151' : '#fff',
                      border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                      borderRadius: '0.5rem',
                      color: darkMode ? '#fff' : '#000'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Asset Allocation Bars with Tooltips */}
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              💼 Allocation détaillée:
            </h3>

            <div className="space-y-3 mb-6">
              {Object.entries(result.allocation).map(([actif, pct], index) => {
                const montant = (result.capital * pct) / 100
                return (
                  <div
                    key={actif}
                    className={`rounded-lg p-4 transition relative ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onMouseEnter={() => setHoveredAsset(actif)}
                    onMouseLeave={() => setHoveredAsset(null)}
                  >
                    {/* Tooltip */}
                    {hoveredAsset === actif && (
                      <div className={`absolute z-10 bottom-full left-0 mb-2 p-3 rounded-lg shadow-lg text-sm ${
                        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'
                      } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        ℹ️ {assetInfo[actif]}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {actif}
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        {pct}%
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-2 mb-2 ${
                      darkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${pct}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                    <div className={`text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatCurrency(montant)} • ~{expectedReturns[actif]}% rendement annuel
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Projection Section */}
            <div className={`border rounded-lg p-6 mb-6 ${
              darkMode 
                ? 'bg-purple-900/30 border-purple-800' 
                : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>
                  🔮 Simulateur de projection temporelle
                </h3>
                <button
                  onClick={() => setShowProjection(!showProjection)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    showProjection
                      ? 'bg-purple-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  {showProjection ? 'Masquer' : 'Afficher la projection'}
                </button>
              </div>

              {showProjection && (
                <>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-purple-300' : 'text-purple-800'
                    }`}>
                      Horizon de temps: {years} ans
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>1 an</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>30 ans</span>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={calculateProjection()}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                      <XAxis 
                        dataKey="year" 
                        label={{ value: 'Années', position: 'insideBottom', offset: -5 }}
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                      />
                      <YAxis 
                        label={{ value: 'Valeur (€)', angle: -90, position: 'insideLeft' }}
                        stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                        tickFormatter={(value) => `${Math.round(value).toLocaleString('fr-FR')}€`}
                      />
                      <RechartsTooltip 
                        contentStyle={{
                          backgroundColor: darkMode ? '#374151' : '#fff',
                          border: `1px solid ${darkMode ? '#4B5563' : '#E5E7EB'}`,
                          borderRadius: '0.5rem',
                          color: darkMode ? '#fff' : '#000'
                        }}
                        formatter={(value) => [formatCurrency(value), 'Valeur']}
                        labelFormatter={(year) => `Année ${year}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className={`mt-4 p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      💡 <strong>Projection estimée:</strong> Avec votre allocation, votre capital de{' '}
                      <strong>{formatCurrency(result.capital)}</strong> pourrait atteindre{' '}
                      <strong className="text-purple-600 dark:text-purple-400">
                        {formatCurrency(calculateProjection()[years].value)}
                      </strong>{' '}
                      dans {years} ans (rendements moyens historiques).
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className={`p-4 border rounded-lg ${
              darkMode 
                ? 'bg-yellow-900/30 border-yellow-800 text-yellow-300' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
              <p className="text-sm">
                ⚠️ <strong>Note:</strong> Ceci est un outil pédagogique, pas un conseil financier
                professionnel. Les projections sont basées sur des rendements historiques moyens et ne garantissent pas les performances futures.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

