'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productService } from '@/lib/firebase/firestore';
import { ProductForm } from '@/components/forms/ProductForm';
import { Product } from '@/types';

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setInitialLoading(true);
    const data = await productService.getById(productId);
    setProduct(data);
    setInitialLoading(false);
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const success = await productService.update(productId, data);
      if (success) {
        router.push('/dashboard/products');
      } else {
        alert('Error updating product. Please try again.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/products');
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Product not found</h2>
        <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={product}
        isEdit={true}
        loading={loading}
      />
    </div>
  );
}