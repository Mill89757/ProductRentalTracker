'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { rentalService, productService } from '@/lib/firebase/firestore';
import { RentalForm } from '@/components/forms/RentalForm';

export default function NewRentalPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const rentalData = {
        productId: data.productId,
        productName: data.selectedProduct.name,
        productSerialNumber: data.selectedProduct.serialNumber,
        staffName: data.staffName,
        storeLocation: data.storeLocation,
        rentalDate: new Date(data.rentalDate),
        dueDate: new Date(data.dueDate),
        status: 'Active' as const
      };
      
      const rentalId = await rentalService.create(rentalData);
      if (rentalId) {
        // Update product status to "Rented Out"
        await productService.update(data.productId, { status: 'Rented Out' });
        router.push('/dashboard/rentals');
      } else {
        alert('Error creating rental. Please try again.');
      }
    } catch (error) {
      console.error('Error creating rental:', error);
      alert('Error creating rental. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/rentals');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book Out Product</h1>
        <p className="text-gray-600 mt-2">Rent a product to a staff member</p>
      </div>

      <RentalForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
}