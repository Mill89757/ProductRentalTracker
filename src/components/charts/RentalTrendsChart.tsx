'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';
import { Rental } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface RentalTrendsChartProps {
  rentals: Rental[];
}

export const RentalTrendsChart: React.FC<RentalTrendsChartProps> = ({ rentals }) => {
  // Generate data for the last 30 days
  const endDate = new Date();
  const startDate = subDays(endDate, 29);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const data = dateRange.map(date => {
    const dayStart = startOfDay(date);
    const rentalsOnDay = rentals.filter(rental => {
      const rentalDate = startOfDay(rental.rentalDate);
      return rentalDate.getTime() === dayStart.getTime();
    }).length;

    const returnsOnDay = rentals.filter(rental => {
      if (!rental.returnDate) return false;
      const returnDate = startOfDay(rental.returnDate);
      return returnDate.getTime() === dayStart.getTime();
    }).length;

    return {
      date: format(date, 'MMM dd'),
      rentals: rentalsOnDay,
      returns: returnsOnDay,
      net: rentalsOnDay - returnsOnDay
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'rentals' && 'New Rentals: '}
              {entry.name === 'returns' && 'Returns: '}
              {entry.name === 'net' && 'Net Change: '}
              {entry.value}
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
        <CardTitle>Rental Activity (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                interval="preserveStartEnd"
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="rentals" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="rentals"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="returns" 
                stroke="#10b981" 
                strokeWidth={2}
                name="returns"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};