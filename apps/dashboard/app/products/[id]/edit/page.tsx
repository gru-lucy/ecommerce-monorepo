'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '../../../../types';

export default function UpdateInventory() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating inventory count to:', product?.inventoryCount);

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: product?.inventoryCount || 0 }),
      });

      if (!response.ok) {
        throw new Error('Failed to update inventory');
      }

      window.location.href = '/products';
    } catch (err) {
      setError(err as string);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product details');
          }
          const data = await response.json();
          setProduct(data);
        } catch (err) {
          setError(err as string);
        } finally {
          setLoading(false);
        }
      };

      fetchProductDetails();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>No product found</div>;

  return (
    <div className="w-full mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Update Inventory</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="productId"
            className="block text-sm font-medium text-gray-700"
          >
            Product ID
          </label>
          <input
            type="text"
            id="productId"
            value={product.id}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            value={product.name}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-gray-500 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="inventoryCount"
            className="block text-sm font-medium text-gray-700"
          >
            Inventory Count
          </label>
          <input
            type="number"
            id="inventoryCount"
            value={product.inventoryCount}
            min={0}
            onChange={(e) =>
              setProduct({
                ...product,
                inventoryCount: parseInt(e.target.value),
              })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Inventory
          </button>
        </div>
      </form>
    </div>
  );
}
