
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Table as TableIcon, 
  TrendingUp, 
  Sparkles,
  Menu,
  X,
  Tag,
  Settings as SettingsIcon,
  DownloadCloud
} from 'lucide-react';
import { ViewType, InventoryItem, Table, Transaction, TableStatus, AppSettings } from './types';
import Dashboard from './components/Dashboard';
import StockManager from './components/StockManager';
import TableManager from './components/TableManager';
import FinanceManager from './components/FinanceManager';
import GeminiAdvisor from './components/GeminiAdvisor';
import SettingsManager from './components/SettingsManager';

const INITIAL_STOCK: InventoryItem[] = [
  { id: '1', name: 'Sorvete Baunilha', category: 'Base', quantity: 150, unit: 'un', minQuantity: 50, price: 4.50 },
  { id: '2', name: 'Sorvete Chocolate', category: 'Base', quantity: 120, unit: 'un', minQuantity: 50, price: 4.80 },
  { id: '3', name: 'Cobertura Morango', category: 'Topping', quantity: 80, unit: 'un', minQuantity: 30, price: 2.50 },
  { id: '4', name: 'Casquinhas', category: 'Embalagem', quantity: 450, unit: 'un', minQuantity: 50, price: 0.50 },
];

const INITIAL_TABLES: Table[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  number: i + 1,
  status: TableStatus.AVAILABLE,
  currentOrder: []
}));

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Persistence Loading
  const [stock, setStock] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('gelato_stock');
    return saved ? JSON.parse(saved) : INITIAL_STOCK;
  });
  
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('gelato_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('gelato_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('gelato_settings');
    return saved ? JSON.parse(saved) : {
      shopName: 'GelatoMaster',
      themeColor: 'red',
      userName: 'Admin Sorvete',
      userRole: 'Gerente'
    };
  });

  // PWA Install Logic
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // Silent Save
  useEffect(() => localStorage.setItem('gelato_stock', JSON.stringify(stock)), [stock]);
  useEffect(() => localStorage.setItem('gelato_tables', JSON.stringify(tables)), [tables]);
  useEffect(() => localStorage.setItem('gelato_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('gelato_settings', JSON.stringify(settings)), [settings]);

  const themeClasses = {
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', shadow: 'shadow-blue-100', navActive: 'bg-blue-600 text-white' },
    pink: { bg: 'bg-pink-600', text: 'text-pink-600', shadow: 'shadow-pink-100', navActive: 'bg-pink-600 text-white' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', shadow: 'shadow-purple-100', navActive: 'bg-purple-600 text-white' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', shadow: 'shadow-emerald-100', navActive: 'bg-emerald-600 text-white' },
    orange: { bg: 'bg-orange-600', text: 'text-orange-600', shadow: 'shadow-orange-100', navActive: 'bg-orange-600 text-white' },
    red: { bg: 'bg-red-600', text: 'text-red-600', shadow: 'shadow-red-100', navActive: 'bg-red-600 text-white' },
  };

  const currentTheme = themeClasses[settings.themeColor];

  const NavItem: React.FC<{ view: ViewType; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? `${currentTheme.navActive} shadow-lg shadow-opacity-30` 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard stock={stock} transactions={transactions} setTransactions={setTransactions} tables={tables} settings={settings} />;
      case 'STOCK': return <StockManager stock={stock} setStock={setStock} themeColor={settings.themeColor} />;
      case 'TABLES': return <TableManager tables={tables} setTables={setTables} stock={stock} setTransactions={setTransactions} themeColor={settings.themeColor} />;
      case 'FINANCE': return <FinanceManager transactions={transactions} setTransactions={setTransactions} themeColor={settings.themeColor} />;
      case 'OFFERS': return <GeminiAdvisor stock={stock} transactions={transactions} />;
      case 'SETTINGS': return <SettingsManager settings={settings} setSettings={setSettings} />;
      default: return <Dashboard stock={stock} transactions={transactions} setTransactions={setTransactions} tables={tables} settings={settings} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className={`${currentTheme.bg} p-2 rounded-lg`}>
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg">{settings.shopName}</h1>
        </div>
        <div className="flex items-center gap-2">
          {deferredPrompt && (
            <button 
              onClick={handleInstallClick}
              className="p-2 bg-slate-900 text-white rounded-lg"
            >
              <DownloadCloud size={18} />
            </button>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="hidden md:flex items-center space-x-3 mb-10">
            <div className={`${currentTheme.bg} p-2 rounded-xl shadow-lg ${currentTheme.shadow}`}>
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">{settings.shopName}</h1>
          </div>

          <div className="mb-6 px-4">
             {deferredPrompt && (
               <button 
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
               >
                 <DownloadCloud size={16} />
                 <span>INSTALAR APLICATIVO</span>
               </button>
             )}
          </div>
          
          <nav className="space-y-2 flex-1">
            <NavItem view="DASHBOARD" icon={<LayoutDashboard size={20} />} label="Início" />
            <NavItem view="STOCK" icon={<Package size={20} />} label="Estoque" />
            <NavItem view="TABLES" icon={<TableIcon size={20} />} label="Mesas" />
            <NavItem view="FINANCE" icon={<TrendingUp size={20} />} label="Financeiro" />
            <NavItem view="OFFERS" icon={<Tag size={20} />} label="Ofertas" />
            <div className="pt-4 mt-4 border-t border-slate-100">
              <NavItem view="SETTINGS" icon={<SettingsIcon size={20} />} label="Ajustes" />
            </div>
          </nav>

          <div className="pt-6 border-t mt-auto">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(settings.userName)}&background=random`} alt="User" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{settings.userName}</p>
                <p className="text-xs text-slate-500 italic truncate">{settings.userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
