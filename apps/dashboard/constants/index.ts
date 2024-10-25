import type { Column } from '../types';

export const productColumns: Column[] = [
  { key: '_id', header: '#', align: 'center' },
  { key: 'name', header: 'Product Name', align: 'center' },
  { key: 'inventoryCount', header: 'Inventory Count', align: 'center' },
  { key: 'action', header: 'Action', align: 'right' },
];
