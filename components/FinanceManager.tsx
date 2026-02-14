
import React, { useState } from 'react';
import { Transaction, AppSettings, PaymentMethod } from '../types';
import { Plus, ArrowUpCircle, ArrowDownCircle, Search, Calendar, Download, X, Banknote, QrCode, CreditCard } from 'lucide-react';

interface FinanceManagerProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  themeColor: AppSettings['themeColor'];
}

const FinanceManager: React.FC<FinanceManagerProps> = ({ transactions, setTransactions, themeColor }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTrans, setNewTrans] = useState<Partial<Transaction>>({
    type: 'INCOME',
    amount: 0,
    description: '',
    category: 'Geral',
    paymentMethod: 'PIX',
    date: new Date().toISOString().split('T')[0]
  });

  const themeClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
    pink: 'bg-pink-600 hover:bg-pink-700 shadow-pink-200',
    purple: 'bg-purple-600 hover:bg-purple-700 shadow-purple-200',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
    orange: 'bg-orange-600 hover:bg-orange-700 shadow-orange-200',
    red: 'bg-red-600 hover:bg-red-700 shadow-red-200',
  };

  const themeBg = {
    blue: 'bg-blue-600',
    pink: 'bg-pink-600',
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
  };

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);

  const handleAdd = () => {
    if (newTrans.amount && newTrans.description) {
      const trans: Transaction = {
        id: Date.now().toString(),
        type: newTrans.type as any,
        amount: Number(newTrans.amount),
        description: newTrans.description || '',
        category: newTrans.category || 'Geral',
        paymentMethod: newTrans.paymentMethod as PaymentMethod,
        date: newTrans.date || new Date().toISOString()
      };
      setTransactions([...transactions, trans]);
      setIsAdding(false);
      setNewTrans({ type: 'INCOME', amount: 0, description: '', category: 'Geral', paymentMethod: 'PIX', date: new Date().toISOString().split('T')[0] });
    }
  };

  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("Não há transações para exportar.");
      return;
    }

    // Definimos o ponto e vírgula como separador para compatibilidade PT-BR (Excel/Sheets)
    const SEPARATOR = ";";

    // Headers
    const headers = ["Data", "Tipo", "Descrição", "Categoria", "Método de Pagamento", "Valor (R$)"];
    
    // Processamento das linhas
    const rows = transactions.sort((a,b) => b.date.localeCompare(a.date)).map(t => [
      new Date(t.date).toLocaleDateString('pt-BR'),
      t.type === 'INCOME' ? 'Entrada' : 'Saída',
      // Removemos eventuais SEPARATORs da descrição para não quebrar as colunas
      t.description.replace(new RegExp(SEPARATOR, 'g'), ' '),
      t.category,
      t.paymentMethod || 'N/A',
      // Formatamos o valor com vírgula decimal para planilhas brasileiras reconhecerem como número
      t.amount.toFixed(2).replace('.', ',')
    ]);

    // Build content with BOM (\uFEFF) para garantir que o Sheets/Excel abra com UTF-8 (acentos corretos)
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(SEPARATOR)).join("\n");
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `financeiro-sorveteria-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPaymentIcon = (method?: PaymentMethod) => {
    switch (method) {
      case 'DINHEIRO': return <Banknote size={14} className="text-emerald-500" />;
      case 'PIX': return <QrCode size={14} className="text-blue-500" />;
      case 'CARTÃO': return <CreditCard size={14} className="text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financeiro</h2>
          <p className="text-slate-500">Controle de fluxo de caixa e lucros.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToCSV}
            className="bg-white border text-slate-700 px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-slate-50 transition-all group"
          >
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            <span>Exportar (Google Sheets)</span>
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className={`${themeClasses[themeColor]} text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg`}
          >
            <Plus size={20} />
            <span>Nova Transação</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-600 uppercase">Entradas</span>
            <ArrowUpCircle className="text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-emerald-900">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-600 uppercase">Saídas</span>
            <ArrowDownCircle className="text-rose-500" />
          </div>
          <h3 className="text-3xl font-black text-rose-900">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className={`${themeBg[themeColor]} p-6 rounded-3xl shadow-xl text-white`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white/70 uppercase">Saldo Líquido</span>
            <span className="text-white/70 text-xs">Total acumulado</span>
          </div>
          <h3 className="text-3xl font-black">R$ {(totalIncome - totalExpense).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h4 className="font-bold text-lg">Histórico de Transações</h4>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Filtrar..." className="pl-9 pr-4 py-2 bg-slate-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-200" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length > 0 ? (
                transactions.sort((a,b) => b.date.localeCompare(a.date)).map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {t.type === 'INCOME' ? (
                          <ArrowUpCircle size={16} className="text-emerald-500" />
                        ) : (
                          <ArrowDownCircle size={16} className="text-rose-500" />
                        )}
                        <span className="font-medium text-slate-900">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {t.paymentMethod ? (
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit">
                          {getPaymentIcon(t.paymentMethod)}
                          <span>{t.paymentMethod}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{t.category}</td>
                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'INCOME' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                    Nenhuma transação registrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">Nova Transação</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setNewTrans({...newTrans, type: 'INCOME'})}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${newTrans.type === 'INCOME' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500'}`}
                >
                  Entrada
                </button>
                <button 
                  onClick={() => setNewTrans({...newTrans, type: 'EXPENSE'})}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${newTrans.type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-500'}`}
                >
                  Saída
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <input 
                  type="text"
                  className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  value={newTrans.description}
                  onChange={e => setNewTrans({...newTrans, description: e.target.value})}
                  placeholder="Ex: Pagamento Fornecedor Leite"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                <input 
                  type="number"
                  className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  value={newTrans.amount}
                  onChange={e => setNewTrans({...newTrans, amount: Number(e.target.value)})}
                />
              </div>
              
              {newTrans.type === 'INCOME' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Forma de Pagamento</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['DINHEIRO', 'PIX', 'CARTÃO'] as PaymentMethod[]).map(method => (
                      <button
                        key={method}
                        onClick={() => setNewTrans({...newTrans, paymentMethod: method})}
                        className={`py-2 px-1 text-[10px] font-bold rounded-xl border-2 transition-all ${newTrans.paymentMethod === method ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                <input 
                  type="date"
                  className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-slate-200 transition-all"
                  value={newTrans.date}
                  onChange={e => setNewTrans({...newTrans, date: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 border-t bg-slate-50 flex gap-3">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex-1 px-4 py-2 border rounded-xl font-medium hover:bg-white"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAdd}
                className={`flex-1 px-4 py-2 text-white rounded-xl font-medium ${newTrans.type === 'INCOME' ? 'bg-emerald-600' : 'bg-rose-600'}`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManager;
