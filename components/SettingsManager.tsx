
import React, { useRef } from 'react';
import { AppSettings } from '../types';
import { User, Store, Palette, Check, Download, Upload, HardDrive } from 'lucide-react';

interface SettingsManagerProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, setSettings }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors: Array<{id: AppSettings['themeColor'], hex: string, name: string}> = [
    { id: 'red', hex: 'bg-red-600', name: 'Marca' },
    { id: 'blue', hex: 'bg-blue-600', name: 'Clássico' },
    { id: 'pink', hex: 'bg-pink-600', name: 'Morango' },
    { id: 'purple', hex: 'bg-purple-600', name: 'Uva' },
    { id: 'emerald', hex: 'bg-emerald-600', name: 'Menta' },
    { id: 'orange', hex: 'bg-orange-600', name: 'Laranja' },
  ];

  const handleUpdate = (field: keyof AppSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const exportFullBackup = () => {
    const data = {
      stock: JSON.parse(localStorage.getItem('gelato_stock') || '[]'),
      tables: JSON.parse(localStorage.getItem('gelato_tables') || '[]'),
      transactions: JSON.parse(localStorage.getItem('gelato_transactions') || '[]'),
      settings: settings
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_gelato_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        if (confirm('Deseja restaurar este backup? Os dados atuais serão substituídos.')) {
          localStorage.setItem('gelato_stock', JSON.stringify(content.stock));
          localStorage.setItem('gelato_tables', JSON.stringify(content.tables));
          localStorage.setItem('gelato_transactions', JSON.stringify(content.transactions));
          localStorage.setItem('gelato_settings', JSON.stringify(content.settings));
          window.location.reload();
        }
      } catch (err) {
        alert('Erro ao processar arquivo.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ajustes</h2>
        <p className="text-slate-500 font-medium">Personalize sua experiência no sistema.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shop Settings */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Store size={20} />
            </div>
            <h3 className="text-xl font-bold">Dados da Loja</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nome da Sorveteria</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                value={settings.shopName}
                onChange={(e) => handleUpdate('shopName', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* User Settings */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <User size={20} />
            </div>
            <h3 className="text-xl font-bold">Meu Perfil</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Seu Nome</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 focus:bg-white focus:border-purple-500 outline-none transition-all font-bold"
                value={settings.userName}
                onChange={(e) => handleUpdate('userName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Cargo</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 focus:bg-white focus:border-purple-500 outline-none transition-all"
                value={settings.userRole}
                onChange={(e) => handleUpdate('userRole', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Palette size={20} />
            </div>
            <h3 className="text-xl font-bold">Aparência</h3>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleUpdate('themeColor', color.id)}
                className={`
                  relative h-16 rounded-2xl border-2 transition-all group overflow-hidden
                  ${settings.themeColor === color.id ? 'border-slate-900 scale-105 shadow-md' : 'border-transparent'}
                `}
              >
                <div className={`absolute inset-0 ${color.hex} opacity-90 group-hover:opacity-100`} />
                {settings.themeColor === color.id && (
                   <div className="absolute inset-0 flex items-center justify-center text-white">
                      <Check size={20} strokeWidth={4} />
                   </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Backup */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <HardDrive size={20} />
            </div>
            <h3 className="text-xl font-bold">Backup e Segurança</h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-slate-500 leading-relaxed">Salve uma cópia dos seus dados para restaurar em outro dispositivo.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={exportFullBackup}
                className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 text-white py-4 rounded-2xl hover:bg-slate-800 transition-all font-bold shadow-lg"
              >
                <Download size={18} />
                <span>Exportar Dados</span>
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center space-x-2 border-2 border-slate-200 text-slate-700 py-4 rounded-2xl hover:bg-slate-50 transition-all font-bold"
              >
                <Upload size={18} />
                <span>Importar</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={importBackup} 
                className="hidden" 
                accept=".json"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
