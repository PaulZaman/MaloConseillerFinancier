import { useState } from 'react'
import { Briefcase, Info } from 'lucide-react'
import { assetInfo, expectedReturns, COLORS } from '../constants/assetInfo'
import { formatCurrency } from '../utils/portfolioCalculations'

export default function AllocationDisplay({ result, darkMode }) {
  const [hoveredAsset, setHoveredAsset] = useState(null)

  return (
    <>
      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <Briefcase className="w-5 h-5" />
        Allocation détaillée:
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
                <div className={`absolute z-10 bottom-full left-0 mb-2 p-3 rounded-lg shadow-lg text-sm flex items-start gap-2 ${
                  darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-700'
                } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{assetInfo[actif]}</span>
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
    </>
  )
}
