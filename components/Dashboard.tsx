
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { InventoryItem, Transaction, Table, TableStatus, AppSettings, PaymentMethod } from '../types';
import { Package, Users, DollarSign, AlertTriangle, TrendingUp, Wallet, Zap, X, Banknote, QrCode, CreditCard, Check } from 'lucide-react';

interface DashboardProps {
  stock: InventoryItem[];
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  tables: Table[];
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ stock, transactions, setTransactions, tables, settings }) => {
  const [isQuickSellOpen, setIsQuickSellOpen] = useState(false);
  const [quickSellAmount, setQuickSellAmount] = useState('');
  const [quickSellPayment, setQuickSellPayment] = useState<PaymentMethod | null>(null);

  const lowStockItems = stock.filter(item => item.quantity <= item.minQuantity);
  const occupiedTables = tables.filter(table => table.status === TableStatus.OCCUPIED).length;
  
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Processamento de dados para o gráfico de Formas de Pagamento
  const paymentDataMap: Record<PaymentMethod, number> = {
    'DINHEIRO': 0,
    'PIX': 0,
    'CARTÃO': 0
  };

  transactions
    .filter(t => t.type === 'INCOME' && t.paymentMethod)
    .forEach(t => {
      if (t.paymentMethod) {
        paymentDataMap[t.paymentMethod] += t.amount;
      }
    });

  const paymentChartData = [
    { name: 'Dinheiro', value: paymentDataMap['DINHEIRO'], color: '#10b981' }, // Emerald
    { name: 'Pix', value: paymentDataMap['PIX'], color: '#3b82f6' },      // Blue
    { name: 'Cartão', value: paymentDataMap['CARTÃO'], color: '#a855f7' },   // Purple
  ].filter(item => item.value > 0);

  const chartData = [
    { name: 'Entradas', value: totalIncome, color: '#10b981' },
    { name: 'Saídas', value: totalExpense, color: '#f43f5e' },
  ];

  const handleQuickSell = () => {
    if (!quickSellAmount || !quickSellPayment) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'INCOME',
      amount: parseFloat(quickSellAmount),
      description: 'Venda Rápida - Self-Service',
      category: 'Self-Service',
      paymentMethod: quickSellPayment,
      date: new Date().toISOString()
    };

    setTransactions(prev => [...prev, newTransaction]);
    setIsQuickSellOpen(false);
    setQuickSellAmount('');
    setQuickSellPayment(null);
  };

  const themeClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    pink: 'bg-pink-600 hover:bg-pink-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    red: 'bg-red-600 hover:bg-red-700',
  };

  const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; subValue?: string }> = ({ title, value, icon, color, subValue }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Visão Geral - {settings.shopName}</h2>
          <p className="text-slate-500">Bem-vindo de volta! Aqui está o status da sua sorveteria hoje.</p>
        </div>
        <button 
          onClick={() => setIsQuickSellOpen(true)}
          className={`${themeClasses[settings.themeColor]} text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-red-100 transition-all active:scale-95`}
        >
          <Zap size={20} fill="currentColor" />
          <span>Venda Rápida (Self-Service)</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Saldo em Caixa" 
          value={`R$ ${(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={<DollarSign className="text-blue-600" />} 
          color="bg-blue-50"
        />
        <MetricCard 
          title="Mesas Ocupadas" 
          value={`${occupiedTables}/${tables.length}`} 
          icon={<Users className="text-purple-600" />} 
          color="bg-purple-50"
          subValue={`${((occupiedTables/tables.length)*100).toFixed(0)}% de ocupação`}
        />
        <MetricCard 
          title="Estoque Crítico" 
          value={lowStockItems.length} 
          icon={<Package className="text-orange-600" />} 
          color="bg-orange-50"
          subValue="Itens abaixo do mínimo"
        />
        <MetricCard 
          title="Vendas Hoje" 
          value={transactions.filter(t => t.type === 'INCOME').length} 
          icon={<TrendingUp className="text-emerald-600" size={24}/>} 
          color="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Fluxo Financeiro (Total)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Receita por Pagamento</h3>
            <Wallet className="text-slate-400" size={20} />
          </div>
          <div className="h-[250px]">
            {paymentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center">
                <Wallet size={40} className="mb-2 opacity-20" />
                <p className="text-sm">Nenhuma venda registrada ainda para hoje.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Alertas de Estoque</h3>
            <AlertTriangle className="text-orange-500" size={20} />
          </div>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{item.name}</p>
                    <p className="text-xs text-orange-700">Apenas {item.quantity}{item.unit} restantes</p>
                  </div>
                  <div className="text-xs font-bold text-orange-800 bg-orange-200 px-2 py-1 rounded">
                    URGENTE
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-slate-400">
                <Package size={48} className="mb-2 opacity-20" />
                <p>Tudo em dia com o estoque!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Venda Rápida */}
      {isQuickSellOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className={`${themeClasses[settings.themeColor]} p-2 rounded-xl text-white shadow-lg`}>
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Venda Expressa</h3>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Self-Service</p>
                </div>
              </div>
              <button onClick={() => setIsQuickSellOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors border">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Campo de Valor */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block px-1">Valor da Pesagem</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-red-500 transition-colors">R$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    autoFocus
                    placeholder="0,00"
                    value={quickSellAmount}
                    onChange={(e) => setQuickSellAmount(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 pl-16 pr-6 text-4xl font-black outline-none focus:border-red-500 focus:bg-white transition-all placeholder:text-slate-200"
                  />
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block px-1">Forma de Pagamento</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'DINHEIRO', icon: <Banknote size={24} />, color: 'emerald' },
                    { id: 'PIX', icon: <QrCode size={24} />, color: 'blue' },
                    { id: 'CARTÃO', icon: <CreditCard size={24} />, color: 'purple' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setQuickSellPayment(method.id as PaymentMethod)}
                      className={`
                        flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all group
                        ${quickSellPayment === method.id 
                          ? `border-${method.color}-500 bg-${method.color}-50 text-${method.color}-700 shadow-lg scale-105` 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-400'}
                      `}
                    >
                      <div className={`mb-2 ${quickSellPayment === method.id ? `text-${method.color}-600` : 'text-slate-300 group-hover:text-slate-500'}`}>
                        {method.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tight">{method.id}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 flex gap-3">
              <button 
                disabled={!quickSellAmount || !quickSellPayment}
                onClick={handleQuickSell}
                className={`
                  flex-1 py-5 rounded-3xl font-black text-lg flex items-center justify-center space-x-3 transition-all shadow-xl
                  ${quickSellAmount && quickSellPayment 
                    ? 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700 active:scale-95' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}
                `}
              >
                <Check size={24} strokeWidth={3} />
                <span>CONFIRMAR VENDA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
