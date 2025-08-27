'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/lib/firebase/firestore';
import { ProductForm } from '@/components/forms/ProductForm';

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const productData = {
        ...data,
        status: 'Available' as const
      };
      
      const productId = await productService.create(productData);
      if (productId) {
        router.push('/dashboard/products');
      } else {
        alert('Error creating product. Please try again.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/products');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">Add a new product to your inventory</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}