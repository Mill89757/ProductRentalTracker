'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Package, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { productService, rentalService } from '@/lib/firebase/firestore';
import { Product, Rental } from '@/types';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [productsData, rentalsData] = await Promise.all([
      productService.getAll(),
      rentalService.getAll()
    ]);
    setProducts(productsData);
    setRentals(rentalsData);
    setLoading(false);
  };

  const activeRentals = rentals.filter(r => r.status === 'Active');
  const overdueRentals = activeRentals.filter(r => new Date() > r.dueDate);
  const thisMonthRentals = rentals.filter(r => {
    const rentalMonth = r.rentalDate.getMonth();
    const currentMonth = new Date().getMonth();
    return rentalMonth === currentMonth;
  });

  const stats = [
    {
      title: 'Total Products',
      value: products.length.toString(),
      description: 'In inventory',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Rentals',
      value: activeRentals.length.toString(),
      description: 'Currently rented out',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Overdue Items',
      value: overdueRentals.length.toString(),
      description: 'Need attention',
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'This Month',
      value: thisMonthRentals.length.toString(),
      description: 'New rentals',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentRentals = activeRentals.slice(0, 3).map(rental => ({
    id: rental.id,
    productName: rental.productName,
    staffName: rental.staffName,
    dueDate: rental.dueDate.toLocaleDateString(),
    status: new Date() > rental.dueDate ? 'overdue' : 'active',
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your product rental system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rentals */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRentals.map((rental) => (
                <div key={rental.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">{rental.productName}</p>
                    <p className="text-sm text-gray-600">Rented by {rental.staffName}</p>
                    <p className="text-xs text-gray-500">Due: {rental.dueDate}</p>
                  </div>
                  <Badge
                    variant={rental.status === 'overdue' ? 'error' : 'success'}
                  >
                    {rental.status === 'overdue' ? 'Overdue' : 'Active'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/dashboard/products/new')}
                className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">Add New Product</p>
                  <p className="text-sm text-gray-600">Add product to inventory</p>
                </div>
                <Package className="h-5 w-5 text-gray-400" />
              </button>
              
              <button 
                onClick={() => router.push('/dashboard/rentals/new')}
                className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">Book Out Item</p>
                  <p className="text-sm text-gray-600">Rent item to staff</p>
                </div>
                <Users className="h-5 w-5 text-gray-400" />
              </button>

              <button 
                onClick={() => router.push('/dashboard/rentals')}
                className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">View All Rentals</p>
                  <p className="text-sm text-gray-600">Manage active rentals</p>
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}