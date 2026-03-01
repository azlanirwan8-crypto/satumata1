import { RegistryEntry, Transaction, License } from './types';

export const DUMMY_REGISTRY_DATA: RegistryEntry[] = [];

export const DUMMY_TRANSACTIONS: Transaction[] = [];

export const INITIAL_LICENSES: License[] = [
  { id: 1, name: 'Registry Glaukoma', type: 'Glaukoma', status: 'Aktif', expiry: '2025-12-31', cost: 1500000 },
  { id: 2, name: 'Registry Retina', type: 'Retina', status: 'Aktif', expiry: '2025-11-20', cost: 2000000 },
  { id: 3, name: 'Registry Ulkus Kornea', type: 'Ulkus', status: 'Aktif', expiry: '2024-06-15', cost: 1500000 }
];

export const SERVICE_PRICING: Record<string, { monthly: number; yearly: number }> = {
  'Glaukoma': { monthly: 150000, yearly: 1500000 },
  'Retina': { monthly: 200000, yearly: 2000000 },
  'Ulkus': { monthly: 150000, yearly: 1500000 },
  'Uveitis': { monthly: 150000, yearly: 1500000 }
};

export const VARIABLE_SETS: Record<string, string[]> = {
  'uveitis': ['Diagnosis Utama', 'Lokasi Anatomi', 'Onset & Course', 'Visus Awal (LogMAR)', 'TIO Awal'],
  'fundus': ['Diagnosis Retina', 'Status Makula', 'CDR (Cup Disc Ratio)', 'Pendarahan Retina', 'Visus BCVA'],
  'ulkus': ['Ukuran Ulkus (mm)', 'Kedalaman (Depth)', 'Lokasi Infiltrat', 'Hasil Gram/KOH', 'Outcome Visus']
};
