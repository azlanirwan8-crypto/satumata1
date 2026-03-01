export type ViewType = 'dashboard' | 'registry' | 'laporan' | 'payment' | 'license' | 'add-registry';
export type FormMode = 'create' | 'edit' | 'view';

export interface RegistryEntry {
  id: string;
  type: string;
  diag: string;
  date: string;
  details?: any;
}

export interface Transaction {
  id: string;
  date: string;
  item: string;
  method: string;
  amount: number;
  status: string;
}

export interface License {
  id: number;
  name: string;
  type: string;
  status: string;
  expiry: string;
  cost: number;
}

export interface RequestHistoryItem {
  id: string;
  date: string;
  registry: string;
  variables: string[];
  cost: number;
  image: boolean;
}
