
import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, RefreshCw, Megaphone, TrendingUp, Zap, Percent } from 'lucide-react';
import { InventoryItem, Transaction } from '../types';
import { getGeminiAdvice } from '../services/geminiService';

interface GeminiAdvisorProps {
  stock: InventoryItem[];
  transactions: Transaction[];
}

interface Insight {
  title: string;
  description: string;
  impact: string;
}

const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ stock, transactions }) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  const fetchInsights = async () => {
    setLoading(true);
    const result = await getGeminiAdvice(stock, transactions);
    setInsights(result.insights || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 mb-1">
            <Percent size={20} />
            <span className="font-bold uppercase tracking-wider text-xs">Aceleração de Vendas</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 italic">Central de Ofertas IA</h2>
          <p className="text-slate-500">Promoções geradas automaticamente para otimizar seu estoque.</p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-2xl hover:bg-orange-700 transition-all disabled:opacity-50 shadow-xl shadow-orange-100"
        >
          {loading ? <RefreshCw className="animate-spin" size={20} /> : <Megaphone size={20} />}
          <span className="font-bold">Gerar Novas Ofertas</span>
        </button>
      </header>

      {loading ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-2xl opacity-20 animate-pulse" />
            <BrainCircuit className="text-orange-600 relative z-10" size={64} />
          </div>
          <h3 className="text-xl font-bold mb-2">Analisando estoque e padrões...</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            O Gemini está criando as melhores ofertas para fazer seus produtos circularem mais rápido hoje.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.length > 0 ? (
            insights.map((insight, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-[2.5rem] border border-orange-50 shadow-xl shadow-orange-100/20 hover:-translate-y-2 transition-transform duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-12 -mt-12 transition-all group-hover:bg-orange-100" />
                
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {idx === 0 ? <Percent /> : idx === 1 ? <TrendingUp /> : <Zap />}
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{insight.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 relative z-10">
                  {insight.description}
                </p>
                
                <div className="pt-6 border-t border-slate-50 relative z-10">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Impacto no Giro</span>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{insight.impact}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400">Clique em "Gerar Novas Ofertas" para ver sugestões de giro de estoque.</p>
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-orange-200">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl">
            <Megaphone className="text-orange-100" size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Por que girar o estoque?</h3>
            <p className="text-orange-100 max-w-2xl">
              Produtos parados são capital estagnado. Nossas ofertas de IA identificam excessos de insumos (como casquinhas ou bases de baunilha) e sugerem gatilhos mentais para incentivar o consumo imediato pelos seus clientes nas mesas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAdvisor;
