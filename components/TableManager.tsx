
import React, { useState } from 'react';
import { Table, TableStatus, InventoryItem, Transaction, OrderItem, AppSettings, PaymentMethod } from '../types';
import { ShoppingCart, CheckCircle, Plus, X, Trash2, Banknote, QrCode, CreditCard } from 'lucide-react';

interface TableManagerProps {
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  stock: InventoryItem[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  themeColor: AppSettings['themeColor'];
}

const TableManager: React.FC<TableManagerProps> = ({ tables, setTables, stock, setTransactions, themeColor }) => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);

  const themeClasses = {
    blue: { ring: 'ring-blue-500', bg: 'bg-blue-600', hover: 'hover:bg-blue-50 hover:border-blue-200', text: 'text-blue-500', active: 'bg-blue-600 text-white' },
    pink: { ring: 'ring-pink-500', bg: 'bg-pink-600', hover: 'hover:bg-pink-50 hover:border-pink-200', text: 'text-pink-500', active: 'bg-pink-600 text-white' },
    purple: { ring: 'ring-purple-500', bg: 'bg-purple-600', hover: 'hover:bg-purple-50 hover:border-purple-200', text: 'text-purple-500', active: 'bg-purple-600 text-white' },
    emerald: { ring: 'ring-emerald-500', bg: 'bg-emerald-600', hover: 'hover:bg-emerald-50 hover:border-emerald-200', text: 'text-emerald-500', active: 'bg-emerald-600 text-white' },
    orange: { ring: 'ring-orange-500', bg: 'bg-orange-600', hover: 'hover:bg-orange-50 hover:border-orange-200', text: 'text-orange-500', active: 'bg-orange-600 text-white' },
    red: { ring: 'ring-red-500', bg: 'bg-red-600', hover: 'hover:bg-red-50 hover:border-red-200', text: 'text-red-500', active: 'bg-red-600 text-white' },
  };

  const currentTheme = themeClasses[themeColor];

  const addItemToOrder = (productId: string) => {
    if (!selectedTable) return;
    const product = stock.find(s => s.id === productId);
    if (!product) return;

    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      name: product.name,
      quantity: 1,
      price: product.price * 1.5 // Mock markup for selling price
    };

    const updatedTables = tables.map(t => {
      if (t.id === selectedTable.id) {
        return { ...t, currentOrder: [...t.currentOrder, newItem], status: TableStatus.OCCUPIED };
      }
      return t;
    });

    setTables(updatedTables);
    setSelectedTable(updatedTables.find(t => t.id === selectedTable.id) || null);
  };

  const removeItemFromOrder = (orderItemId: string) => {
    if (!selectedTable) return;

    const updatedTables = tables.map(t => {
      if (t.id === selectedTable.id) {
        const newOrder = t.currentOrder.filter(item => item.id !== orderItemId);
        return { ...t, currentOrder: newOrder };
      }
      return t;
    });

    setTables(updatedTables);
    setSelectedTable(updatedTables.find(t => t.id === selectedTable.id) || null);
  };

  const checkoutTable = () => {
    if (!selectedTable || !selectedPayment) return;
    const total = selectedTable.currentOrder.reduce((acc, curr) => acc + curr.price, 0);
    
    if (total > 0) {
      const transaction: Transaction = {
        id: Date.now().toString(),
        type: 'INCOME',
        amount: total,
        description: `Consumo Mesa ${selectedTable.number}`,
        category: 'Venda de Sorvete',
        paymentMethod: selectedPayment,
        date: new Date().toISOString()
      };
      setTransactions(prev => [...prev, transaction]);
    }

    const updatedTables = tables.map(t => {
      if (t.id === selectedTable.id) {
        return { ...t, status: TableStatus.AVAILABLE, currentOrder: [] };
      }
      return t;
    });

    setTables(updatedTables);
    setSelectedTable(null);
    setSelectedPayment(null);
  };

  const handleClosePanel = () => {
    setSelectedTable(null);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Gestão de Mesas</h2>
        <p className="text-slate-500">Acompanhe o consumo e disponibilidade do salão.</p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {tables.map(table => (
          <button
            key={table.id}
            onClick={() => setSelectedTable(table)}
            className={`
              relative p-6 rounded-3xl border-2 transition-all duration-300 text-center flex flex-col items-center group
              ${table.status === TableStatus.AVAILABLE 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:border-emerald-300 shadow-sm' 
                : `bg-white border-slate-200 text-slate-900 shadow-xl ring-2 ${currentTheme.ring} ring-offset-4 ring-offset-slate-50`}
            `}
          >
            <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Mesa</span>
            <span className="text-4xl font-black mb-2">{table.number}</span>
            <div className="flex items-center space-x-1">
              <span className={`w-2 h-2 rounded-full ${table.status === TableStatus.AVAILABLE ? 'bg-emerald-500' : 'bg-blue-500 pulse'}`} />
              <span className="text-[10px] font-bold uppercase">{table.status}</span>
            </div>
            {table.currentOrder.length > 0 && (
              <div className={`absolute -top-2 -right-2 ${currentTheme.bg} text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg`}>
                {table.currentOrder.length}
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedTable && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-2xl font-bold">Mesa {selectedTable.number}</h3>
                <p className="text-sm text-slate-500">{selectedTable.status}</p>
              </div>
              <button onClick={handleClosePanel} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Novo Item</h4>
                <div className="grid grid-cols-2 gap-3">
                  {stock.slice(0, 8).map(item => (
                    <button
                      key={item.id}
                      onClick={() => addItemToOrder(item.id)}
                      className={`flex items-center justify-between p-3 border rounded-2xl transition-all text-left ${currentTheme.hover}`}
                    >
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-400">R$ {(item.price * 1.5).toFixed(2)}</p>
                      </div>
                      <Plus size={16} className={currentTheme.text} />
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Comanda Atual</h4>
                {selectedTable.currentOrder.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTable.currentOrder.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-dashed group/item">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => removeItemFromOrder(item.id)}
                            className="text-rose-400 hover:text-rose-600 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            title="Remover item"
                          >
                            <Trash2 size={16} />
                          </button>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-slate-400">1x Unidade</p>
                          </div>
                        </div>
                        <p className="font-bold text-slate-700">R$ {item.price.toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="pt-4 flex items-center justify-between">
                      <p className="text-lg font-bold">Total</p>
                      <p className={`text-2xl font-black ${currentTheme.text}`}>
                        R$ {selectedTable.currentOrder.reduce((acc, curr) => acc + curr.price, 0).toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t">
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Forma de Pagamento</h4>
                       <div className="grid grid-cols-3 gap-3">
                         <button 
                            onClick={() => setSelectedPayment('DINHEIRO')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${selectedPayment === 'DINHEIRO' ? `border-emerald-500 bg-emerald-50 text-emerald-700` : 'border-slate-100 hover:bg-slate-50'}`}
                         >
                           <Banknote size={24} className="mb-2" />
                           <span className="text-xs font-bold">Dinheiro</span>
                         </button>
                         <button 
                            onClick={() => setSelectedPayment('PIX')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${selectedPayment === 'PIX' ? `border-blue-500 bg-blue-50 text-blue-700` : 'border-slate-100 hover:bg-slate-50'}`}
                         >
                           <QrCode size={24} className="mb-2" />
                           <span className="text-xs font-bold">PIX</span>
                         </button>
                         <button 
                            onClick={() => setSelectedPayment('CARTÃO')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${selectedPayment === 'CARTÃO' ? `border-purple-500 bg-purple-50 text-purple-700` : 'border-slate-100 hover:bg-slate-50'}`}
                         >
                           <CreditCard size={24} className="mb-2" />
                           <span className="text-xs font-bold">Cartão</span>
                         </button>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <ShoppingCart className="mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-400 italic">Mesa vazia. Adicione itens acima.</p>
                  </div>
                )}
              </section>
            </div>

            <div className="p-6 border-t bg-slate-50 space-y-3">
              <button 
                disabled={selectedTable.currentOrder.length === 0 || !selectedPayment}
                onClick={checkoutTable}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-emerald-100"
              >
                <CheckCircle size={20} />
                <span>{selectedPayment ? `Finalizar (${selectedPayment})` : 'Selecione Pagamento'}</span>
              </button>
              <button 
                onClick={handleClosePanel}
                className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-2xl font-semibold hover:bg-white/50"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManager;
