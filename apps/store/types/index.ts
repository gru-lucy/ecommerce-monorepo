import React from 'react';

export interface Product {
  id: string;
  name: string;
  inventoryCount: number;
}

export interface ProductColumn {
  _id: number;
  name: string;
  inventoryCount: number;
  action?: React.ReactNode;
}

export interface Column {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
}
