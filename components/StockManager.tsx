
import React, { useState } from 'react';
import { InventoryItem, AppSettings } from '../types';
import { Plus, Search, Filter, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';

interface StockManagerProps {
  stock: InventoryItem[];
  setStock: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  themeColor: AppSettings['themeColor'];
}

const StockManager: React.FC<StockManagerProps> = ({ stock, setStock, themeColor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: '',
    category: 'Sorvetes',
    quantity: 0,
    unit: 'un',
    minQuantity: 1,
    price: 0
  });

  const themeClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
    pink: 'bg-pink-600 hover:bg-pink-700 shadow-pink-200',
    purple: 'bg-purple-600 hover:bg-purple-700 shadow-purple-200',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
    orange: 'bg-orange-600 hover:bg-orange-700 shadow-orange-200',
    red: 'bg-red-600 hover:bg-red-700 shadow-red-200',
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'Sorvetes', quantity: 0, unit: 'un', minQuantity: 1, price: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (formData.name && formData.quantity !== undefined) {
      if (editingItem) {
        setStock(prev => prev.map(s => s.id === editingItem.id ? { ...s, ...formData } as InventoryItem : s));
      } else {
        const item: InventoryItem = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name || '',
          category: formData.category || 'Outros',
          quantity: Number(formData.quantity),
          unit: 'un',
          minQuantity: Number(formData.minQuantity || 1),
          price: Number(formData.price || 0)
        };
        setStock(prev => [...prev, item]);
      }
      setIsModalOpen(false);
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setStock(prev => prev.filter(i => i.id !== itemToDelete));
      setItemToDelete(null);
      setIsModalOpen(false); // Fecha o modal de edição se estiver aberto
    }
  };

  const filteredStock = stock.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gerenciamento de Estoque</h2>
          <p className="text-slate-500">Controle seus insumos e produtos por unidade.</p>
        </div>
        <button 
          onClick={openAddModal}
          className={`${themeClasses[themeColor]} text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg`}
        >
          <Plus size={20} />
          <span>Novo Item</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-50 border rounded-xl flex items-center space-x-2 text-slate-600 hover:bg-slate-100 transition-all">
              <Filter size={18} />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Quantidade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStock.length > 0 ? (
                filteredStock.map(item => {
                  const isLow = item.quantity <= item.minQuantity;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-400">Custo: R$ {item.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          themeColor === 'blue' ? 'bg-blue-50 text-blue-700' :
                          themeColor === 'pink' ? 'bg-pink-50 text-pink-700' :
                          themeColor === 'purple' ? 'bg-purple-50 text-purple-700' :
                          themeColor === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                          themeColor === 'red' ? 'bg-red-50 text-red-700' :
                          'bg-orange-50 text-orange-700'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium text-slate-700">
                        {item.quantity} un
                      </td>
                      <td className="px-6 py-4">
                        {isLow ? (
                          <span className="flex items-center text-rose-500 text-xs font-bold space-x-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span>ABAIXO DO MÍNIMO</span>
                          </span>
                        ) : (
                          <span className="flex items-center text-emerald-500 text-xs font-bold space-x-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>ESTÁVEL</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setItemToDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                    Nenhum item encontrado no estoque.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Adição/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold">{editingItem ? 'Editar Item' : 'Adicionar Novo Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white border transition-all"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 font-semibold">Nome do Item</label>
                <input 
                  type="text"
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-slate-300 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Sorvete de Pistache"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 font-semibold">Qtd Atual (un)</label>
                  <input 
                    type="number"
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-slate-300 outline-none transition-all"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 font-semibold">Qtd Mínima (un)</label>
                  <input 
                    type="number"
                    className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 focus:border-slate-300 outline-none transition-all"
                    value={formData.minQuantity}
                    onChange={e => setFormData({...formData, minQuantity: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 font-semibold">Preço Unidade (Custo)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 focus:border-slate-300 outline-none transition-all"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
              </div>

              {editingItem && (
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <button 
                    onClick={() => setItemToDelete(editingItem.id)}
                    className="w-full flex items-center justify-center space-x-2 p-3 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors font-bold text-sm"
                  >
                    <Trash2 size={16} />
                    <span>EXCLUIR ITEM DO ESTOQUE</span>
                  </button>
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-slate-50 flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 border rounded-xl font-bold text-slate-600 hover:bg-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                className={`flex-1 px-4 py-3 text-white rounded-xl font-bold ${themeClasses[themeColor]} transition-all active:scale-95`}
              >
                {editingItem ? 'Salvar Alterações' : 'Salvar Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmar Exclusão?</h3>
              <p className="text-slate-500 text-sm">
                Esta ação não pode ser desfeita. O item será removido permanentemente do seu controle de estoque.
              </p>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 px-4 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-100"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManager;
