'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Product } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface LocationDistributionChartProps {
  products: Product[];
}

export const LocationDistributionChart: React.FC<LocationDistributionChartProps> = ({ products }) => {
  const locationData = products.reduce((acc, product) => {
    const location = product.storeLocation;
    if (!acc[location]) {
      acc[location] = { location, available: 0, rented: 0, total: 0 };
    }
    acc[location].total += 1;
    if (product.status === 'Available') {
      acc[location].available += 1;
    } else {
      acc[location].rented += 1;
    }
    return acc;
  }, {} as Record<string, { location: string; available: number; rented: number; total: number }>);

  const data = Object.values(locationData).map(item => ({
    location: item.location,
    Available: item.available,
    'Rented Out': item.rented,
    total: item.total
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0].payload.total;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-gray-600 mb-2">Total: {total} items</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Available" stackId="a" fill="#10b981" />
              <Bar dataKey="Rented Out" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};