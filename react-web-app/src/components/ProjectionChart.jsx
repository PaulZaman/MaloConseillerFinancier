import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import { Lightbulb, BarChart2 } from 'lucide-react'
import { calculateProjection, formatCurrency } from '../utils/portfolioCalculations'
import { assetVolatility } from '../constants/assetInfo'

export default function ProjectionChart({ result, years, setYears, darkMode }) {
  const projectionData = calculateProjection(result, years)

  // Calculate portfolio volatility for display
  let portfolioVolatility = 0
  Object.entries(result.allocation).forEach(([asset, percentage]) => {
    portfolioVolatility += (percentage / 100) * assetVolatility[asset]
  })
  const volatilityPercent = (portfolioVolatility * 100).toFixed(1)

  return (
    <div className={`border rounded-lg p-6 mb-6 ${
      darkMode 
        ? 'bg-purple-900/30 border-purple-800' 
        : 'bg-purple-50 border-purple-200'
    }`}>
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

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={projectionData}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
          <XAxis 
            dataKey="year" 
            label={{ 
              value: `Années (calculé sur ${years * 252} jours de trading)`, 
              position: 'insideBottom', 
              offset: -5,
              style: { fontSize: 12 }
            }}
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
          {/* Baseline (smooth growth) */}
          <Line 
            type="monotone" 
            dataKey="baseline" 
            stroke={darkMode ? '#6B7280' : '#9CA3AF'}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Croissance linéaire"
          />
          {/* Actual projection with daily volatility */}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={'#8b5cf6'}
            strokeWidth={2}
            dot={false}
            name="Projection avec volatilité quotidienne"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className={`mt-4 p-4 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-white'
      }`}>
        <p className={`text-sm flex items-start gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Projection ultra-réaliste:</strong> Cette simulation calcule{' '}
            <strong className="text-purple-600 dark:text-purple-400">jour par jour</strong>{' '}
            ({years * 252} jours de trading) l'évolution de votre portefeuille.
          </span>
        </p>
        <p className={`text-sm mt-2 flex items-start gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <BarChart2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Volatilité de votre portefeuille: {volatilityPercent}%</strong> (annuelle).
            Les fluctuations de la courbe correspondent exactement à cette volatilité calculée 
            à partir de votre allocation, puis tend naturellement vers la moyenne attendue.
          </span>
        </p>
        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Capital: <strong>{formatCurrency(result.capital)}</strong> → Objectif:{' '}
          <strong className="text-purple-600 dark:text-purple-400">
            {formatCurrency(projectionData[projectionData.length - 1].value)}
          </strong>{' '}
          dans {years} ans.
        </p>
      </div>
    </div>
  )
}
