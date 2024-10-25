import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/products/${id}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }

    const productData = await response.json();

    return NextResponse.json(productData);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const { quantity } = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/products/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update inventory count');
    }

    const updatedProductData = await response.json();
    return NextResponse.json(updatedProductData);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
