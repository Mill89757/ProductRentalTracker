'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().min(1, 'Description is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  storeLocation: z.string().min(1, 'Store location is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ProductFormData>;
  isEdit?: boolean;
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
  loading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
  });

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              placeholder="e.g., DJI Mavic 3 Pro"
              error={errors.name?.message}
              {...register('name')}
            />
            
            <Input
              label="SKU"
              placeholder="e.g., DJI-MAVIC3PRO"
              error={errors.sku?.message}
              {...register('sku')}
            />
          </div>

          <Input
            label="Description"
            placeholder="e.g., Flagship DJI drone with triple-camera system"
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Serial Number"
              placeholder="e.g., DJIAU-MV3P-0010"
              error={errors.serialNumber?.message}
              {...register('serialNumber')}
            />
            
            <Input
              label="Store Location"
              placeholder="e.g., SYD"
              error={errors.storeLocation?.message}
              {...register('storeLocation')}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              {isEdit ? 'Update Product' : 'Add Product'}
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