
export enum TableStatus {
  AVAILABLE = 'Disponível',
  OCCUPIED = 'Ocupada',
  RESERVED = 'Reservada'
}

export type PaymentMethod = 'DINHEIRO' | 'PIX' | 'CARTÃO';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Table {
  id: number;
  number: number;
  status: TableStatus;
  currentOrder: OrderItem[];
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  category: string;
  date: string;
  paymentMethod?: PaymentMethod;
}

export interface AppSettings {
  shopName: string;
  themeColor: 'blue' | 'pink' | 'purple' | 'emerald' | 'orange' | 'red';
  userName: string;
  userRole: string;
}

export type ViewType = 'DASHBOARD' | 'STOCK' | 'TABLES' | 'FINANCE' | 'OFFERS' | 'SETTINGS';
