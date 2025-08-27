'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { rentalService, productService } from '@/lib/firebase/firestore';
import { Rental } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Plus, Calendar, User, Package, ArrowLeft } from 'lucide-react';

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    setLoading(true);
    const data = await rentalService.getAll();
    setRentals(data);
    setLoading(false);
  };

  const handleReturn = async (rental: Rental) => {
    if (confirm(`Are you sure you want to mark ${rental.productName} as returned?`)) {
      const success = await rentalService.returnItem(rental.id, new Date());
      if (success) {
        // Update product status back to Available
        await productService.update(rental.productId, { status: 'Available' });
        await loadRentals();
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const isOverdue = (dueDate: Date, status: string) => {
    return status === 'Active' && new Date() > dueDate;
  };

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rentals</h1>
          <p className="text-gray-600 mt-2">Manage product rentals and returns</p>
        </div>
        <Button onClick={() => router.push('/dashboard/rentals/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Book Out Product
        </Button>
      </div>

      {/* Rentals List */}
      {rentals.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rentals yet</h3>
          <p className="text-gray-600 mb-6">Start by booking out your first product</p>
          <Button onClick={() => router.push('/dashboard/rentals/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Book Out Product
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {rentals.map((rental) => (
            <Card key={rental.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {rental.productName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Serial: {rental.productSerialNumber}
                  </p>
                </div>
                <Badge
                  variant={
                    rental.status === 'Returned' 
                      ? 'default' 
                      : isOverdue(rental.dueDate, rental.status)
                      ? 'error'
                      : 'success'
                  }
                >
                  {rental.status === 'Returned' 
                    ? 'Returned' 
                    : isOverdue(rental.dueDate, rental.status)
                    ? `Overdue ${getDaysOverdue(rental.dueDate)} days`
                    : 'Active'
                  }
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {rental.staffName} • {rental.storeLocation}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Rented: {formatDate(rental.rentalDate)}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Due: {formatDate(rental.dueDate)}
                </div>

                {rental.returnDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Returned: {formatDate(rental.returnDate)}
                  </div>
                )}
              </div>

              {rental.status === 'Active' && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => handleReturn(rental)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Mark as Returned
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {rentals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {rentals.filter(r => r.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active Rentals</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {rentals.filter(r => r.status === 'Active' && isOverdue(r.dueDate, r.status)).length}
            </div>
            <div className="text-sm text-gray-600">Overdue Items</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {rentals.filter(r => r.status === 'Returned').length}
            </div>
            <div className="text-sm text-gray-600">Returned Items</div>
          </Card>
        </div>
      )}
    </div>
  );
}