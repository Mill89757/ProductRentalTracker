'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/lib/firebase/firestore';
import { seedDatabase } from '@/lib/firebase/seedData';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Plus, Edit, Trash2, Package } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getAll();
    setProducts(data);
    setLoading(false);
  };

  const handleSeedData = async () => {
    setSeeding(true);
    await seedDatabase();
    await loadProducts();
    setSeeding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await productService.delete(id);
      if (success) {
        await loadProducts();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-none">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product inventory</p>
        </div>
        <div className="flex gap-3">
          {products.length === 0 && (
            <Button
              variant="outline"
              onClick={handleSeedData}
              loading={seeding}
              disabled={seeding}
            >
              <Package className="h-4 w-4 mr-2" />
              Seed Demo Data
            </Button>
          )}
          <Button onClick={() => router.push('/dashboard/products/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first product or loading demo data</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleSeedData} loading={seeding} disabled={seeding}>
              <Package className="h-4 w-4 mr-2" />
              Load Demo Data
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/products/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </Card>
      ) : (
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
                      <p className="text-sm text-gray-500 mb-3 min-h-[3.25rem] overflow-hidden">
                        {product.description}
                      </p>
                    </div>
                    <Badge 
                      variant={product.status === 'Available' ? 'success' : 'warning'}
                    >
                      {product.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Serial:</span>
                      <span className="text-gray-900 font-mono">{product.serialNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Location:</span>
                      <span className="text-gray-900">{product.storeLocation}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}