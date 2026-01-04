
import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { REVENUE_DATA_SETS } from '../constants';

const RevenueChart: React.FC = () => {
  const [period, setPeriod] = useState('6m');
  const activeData = REVENUE_DATA_SETS[period] || REVENUE_DATA_SETS['6m'];

  return (
    <div className="bg-nutri-card p-6 md:p-8 rounded-3xl border border-nutri-border shadow-nutri-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h3 className="text-lg font-black text-nutri-text uppercase tracking-widest">Crescimento de Receita</h3>
        <select 
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-nutri-main text-[10px] font-black uppercase tracking-widest border border-nutri-border rounded-xl px-4 py-2.5 text-nutri-text outline-none focus:ring-4 focus:ring-nutri-blue/10 focus:border-nutri-blue transition-all cursor-pointer shadow-sm"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="3m">Últimos 3 meses</option>
          <option value="6m">Últimos 6 meses</option>
          <option value="1y">Último ano</option>
        </select>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#84d1c1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#84d1c1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 700 }}
              tickFormatter={(value) => `R$${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Faturamento']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#84d1c1" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
