import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { COLORS } from '../constants/assetInfo'

export default function PieChartDisplay({ result, darkMode }) {
  const getPieChartData = () => {
    if (!result) return []
    return Object.entries(result.allocation)
      .filter(([_, pct]) => pct > 0)
      .map(([name, value]) => ({ name, value }))
  }

  return (
    <div className="mb-8">
      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        <PieChartIcon className="w-5 h-5" />
        Répartition visuelle:
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
  )
}
