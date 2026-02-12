import { useState, useEffect } from 'react'
import { Coins, Sun, Moon, BarChart3, AlertCircle, LineChart } from 'lucide-react'
import FormInputs from './components/FormInputs'
import PieChartDisplay from './components/PieChartDisplay'
import AllocationDisplay from './components/AllocationDisplay'
import ProjectionChart from './components/ProjectionChart'
import { choisirProfil, formatCurrency } from './utils/portfolioCalculations'

function App() {
  const [capital, setCapital] = useState('')
  const [risque, setRisque] = useState('faible')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [years, setYears] = useState(10)
  const [showProjection, setShowProjection] = useState(false)

  // Toggle dark mode on body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

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
            <h1 className={`text-4xl font-bold mb-2 flex items-center justify-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Coins className="w-10 h-10" />
              Conseiller en Investissement
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
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Form Section */}
        <div className={`rounded-lg shadow-xl p-8 mb-8 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <FormInputs
            capital={capital}
            setCapital={setCapital}
            risque={risque}
            setRisque={setRisque}
            error={error}
            onSubmit={handleSubmit}
            darkMode={darkMode}
          />
        </div>

        {/* Results Section */}
        {result && (
          <div className={`rounded-lg shadow-xl p-8 animate-fade-in ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="w-6 h-6" />
              Recommandation d'investissement
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
            <PieChartDisplay result={result} darkMode={darkMode} />

            {/* Asset Allocation Bars with Tooltips */}
            <AllocationDisplay result={result} darkMode={darkMode} />

            {/* Projection Section */}
            <div className={`border rounded-lg p-6 mb-6 ${
              darkMode 
                ? 'bg-purple-900/30 border-purple-800' 
                : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>
                  <LineChart className="w-5 h-5" />
                  Simulateur de projection temporelle
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
                <ProjectionChart
                  result={result}
                  years={years}
                  setYears={setYears}
                  darkMode={darkMode}
                />
              )}
            </div>

            <div className={`p-4 border rounded-lg ${
              darkMode 
                ? 'bg-yellow-900/30 border-yellow-800 text-yellow-300' 
                : 'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
              <p className="text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span><strong>Note:</strong> Ceci est un outil pédagogique, pas un conseil financier
                professionnel. Les projections sont basées sur des rendements historiques moyens et ne garantissent pas les performances futures.</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
