'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { productService } from '@/lib/firebase/firestore';
import { Product } from '@/types';

const rentalSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  staffName: z.string().min(1, 'Staff name is required'),
  storeLocation: z.string().min(1, 'Store location is required'),
  rentalDate: z.string().min(1, 'Rental date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

type RentalFormData = z.infer<typeof rentalSchema>;

interface RentalFormProps {
  onSubmit: (data: RentalFormData & { selectedProduct: Product }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const RentalForm: React.FC<RentalFormProps> = ({
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      rentalDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 2 weeks from now
    }
  });

  const watchedProductId = watch('productId');

  useEffect(() => {
    loadAvailableProducts();
  }, []);

  useEffect(() => {
    if (watchedProductId) {
      const product = availableProducts.find(p => p.id === watchedProductId);
      setSelectedProduct(product || null);
      if (product) {
        setValue('storeLocation', product.storeLocation);
      }
    }
  }, [watchedProductId, availableProducts, setValue]);

  const loadAvailableProducts = async () => {
    setLoadingProducts(true);
    const products = await productService.getAvailable();
    setAvailableProducts(products);
    setLoadingProducts(false);
  };

  const handleFormSubmit = async (data: RentalFormData) => {
    if (selectedProduct) {
      await onSubmit({ ...data, selectedProduct });
    }
  };

  const productOptions = availableProducts.map(product => ({
    value: product.id,
    label: `${product.name} (${product.sku}) - ${product.serialNumber}`
  }));

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Book Out Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Select
            label="Product"
            options={productOptions}
            error={errors.productId?.message}
            disabled={loadingProducts}
            {...register('productId')}
          />

          {selectedProduct && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Selected Product Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-700">Name:</span> {selectedProduct.name}
                </div>
                <div>
                  <span className="text-blue-700">SKU:</span> {selectedProduct.sku}
                </div>
                <div>
                  <span className="text-blue-700">Serial:</span> {selectedProduct.serialNumber}
                </div>
                <div>
                  <span className="text-blue-700">Location:</span> {selectedProduct.storeLocation}
                </div>
              </div>
            </div>
          )}

          <Input
            label="Staff Name"
            placeholder="e.g., John Doe"
            error={errors.staffName?.message}
            {...register('staffName')}
          />

          <Input
            label="Store Location"
            placeholder="e.g., CAR"
            error={errors.storeLocation?.message}
            {...register('storeLocation')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Rental Date"
              type="date"
              error={errors.rentalDate?.message}
              {...register('rentalDate')}
            />
            
            <Input
              label="Due Date"
              type="date"
              error={errors.dueDate?.message}
              {...register('dueDate')}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !selectedProduct}
              className="flex-1"
            >
              Book Out Product
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};