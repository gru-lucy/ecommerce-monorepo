import type { Product, ProductColumn } from '../../types';
import Table from '../components/table';
import { productColumns } from '../../constants';
import Link from 'next/link';

const fetchProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_API}/api/products`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
};

const ProductsPage = async () => {
  let raws: ProductColumn[] = [];

  try {
    const products: Product[] = await fetchProducts();
    raws = products.map((product, index) => ({
      ...product,
      _id: index + 1,
      action: (
        <Link
          href={`/products/${product.id}/edit`}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          Edit
        </Link>
      ),
    }));
  } catch (error) {
    console.error(error);
  }

  return <Table columns={productColumns} data={raws} />;
};

export default ProductsPage;
