'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Product } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ProductStatusChartProps {
  products: Product[];
}

const COLORS = {
  'Available': '#10b981',
  'Rented Out': '#f59e0b',
};

export const ProductStatusChart: React.FC<ProductStatusChartProps> = ({ products }) => {
  const data = [
    {
      name: 'Available',
      value: products.filter(p => p.status === 'Available').length,
      color: COLORS['Available']
    },
    {
      name: 'Rented Out',
      value: products.filter(p => p.status === 'Rented Out').length,
      color: COLORS['Rented Out']
    }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-lg font-bold" style={{ color: data.payload.color }}>
            {data.value} items
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};