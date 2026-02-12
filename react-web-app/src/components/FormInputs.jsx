import { Shield, TrendingUp, AlertCircle } from 'lucide-react'

export default function FormInputs({ capital, setCapital, risque, setRisque, error, onSubmit, darkMode }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
            className={`py-3 px-6 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              risque === 'faible'
                ? 'bg-indigo-600 text-white shadow-lg'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Shield className="w-5 h-5" />
            Faible
          </button>
          <button
            type="button"
            onClick={() => setRisque('élevée')}
            className={`py-3 px-6 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              risque === 'élevée'
                ? 'bg-indigo-600 text-white shadow-lg'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Élevée
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
      >
        Obtenir ma recommandation
      </button>
    </form>
  )
}
