'use client';

import React from 'react';
import { Product, Rental } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, TrendingUp, Clock, MapPin } from 'lucide-react';

interface InsightsPanelProps {
  products: Product[];
  rentals: Rental[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ products, rentals }) => {
  const activeRentals = rentals.filter(r => r.status === 'Active');
  const overdueRentals = activeRentals.filter(r => new Date() > r.dueDate);
  
  // Calculate popular products
  const productRentalCounts = rentals.reduce((acc, rental) => {
    acc[rental.productName] = (acc[rental.productName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const popularProducts = Object.entries(productRentalCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Calculate location utilization
  const locationStats = products.reduce((acc, product) => {
    const location = product.storeLocation;
    if (!acc[location]) {
      acc[location] = { total: 0, rented: 0 };
    }
    acc[location].total += 1;
    if (product.status === 'Rented Out') {
      acc[location].rented += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; rented: number }>);

  const locationUtilization = Object.entries(locationStats)
    .map(([location, stats]) => ({
      location,
      utilization: (stats.rented / stats.total) * 100
    }))
    .sort((a, b) => b.utilization - a.utilization);

  // Calculate average rental duration
  const completedRentals = rentals.filter(r => r.returnDate);
  const avgDuration = completedRentals.length > 0 
    ? completedRentals.reduce((sum, rental) => {
        const duration = rental.returnDate!.getTime() - rental.rentalDate.getTime();
        return sum + (duration / (1000 * 60 * 60 * 24)); // Convert to days
      }, 0) / completedRentals.length
    : 0;

  const insights = [
    {
      title: 'Overdue Alert',
      value: overdueRentals.length,
      description: overdueRentals.length > 0 
        ? `${overdueRentals.length} item${overdueRentals.length > 1 ? 's' : ''} overdue`
        : 'All rentals on track',
      icon: AlertTriangle,
      color: overdueRentals.length > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: overdueRentals.length > 0 ? 'bg-red-100' : 'bg-green-100'
    },
    {
      title: 'Utilization Rate',
      value: `${Math.round((activeRentals.length / products.length) * 100)}%`,
      description: 'Products currently in use',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Average Duration',
      value: `${Math.round(avgDuration)}d`,
      description: 'Average rental period',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{insight.title}</p>
                <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
                <p className="text-xs text-gray-500">{insight.description}</p>
              </div>
              <div className={`p-2 rounded-full ${insight.bgColor}`}>
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Popular Products & Location Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Popular Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularProducts.length > 0 ? popularProducts.map(([product, count], index) => (
                <div key={product} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{product}</span>
                  </div>
                  <Badge variant="default">{count} rentals</Badge>
                </div>
              )) : (
                <p className="text-sm text-gray-500 py-4">No rental data available yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {locationUtilization.map(({ location, utilization }) => (
                <div key={location} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{location}</span>
                    <span className="text-sm text-gray-600">{Math.round(utilization)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        utilization > 75 ? 'bg-red-500' :
                        utilization > 50 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};