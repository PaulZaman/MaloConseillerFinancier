import { useState } from 'react'

function App() {
  const [capital, setCapital] = useState('')
  const [risque, setRisque] = useState('faible')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            💰 Conseiller en Investissement
          </h1>
          <p className="text-gray-600">Outil de décision pédagogique</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-2">
                Capital à investir (en €)
              </label>
              <input
                type="text"
                id="capital"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                placeholder="Ex: 5000 ou 5000.50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tolérance au risque
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRisque('faible')}
                  className={`py-3 px-6 rounded-lg font-medium transition ${
                    risque === 'faible'
                      ? 'bg-indigo-600 text-white shadow-lg'
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
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📈 Élevée
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
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

        {result && (
          <div className="bg-white rounded-lg shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Recommandation d'investissement
            </h2>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <p className="font-medium text-indigo-900">
                Capital: {formatCurrency(result.capital)}
              </p>
              <p className="text-sm text-indigo-700 mt-2">
                {result.justification}
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Allocation recommandée:
            </h3>

            <div className="space-y-3">
              {Object.entries(result.allocation).map(([actif, pct]) => {
                const montant = (result.capital * pct) / 100
                return (
                  <div
                    key={actif}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{actif}</span>
                      <span className="text-indigo-600 font-semibold">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-gray-600">
                      {formatCurrency(montant)}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Note:</strong> Ceci est un outil pédagogique, pas un conseil financier
                professionnel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
