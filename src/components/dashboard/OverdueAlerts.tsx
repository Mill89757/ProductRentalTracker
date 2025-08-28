'use client';

import React from 'react';
import { Rental } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Calendar, User, Phone } from 'lucide-react';
import { format } from 'date-fns';

interface OverdueAlertsProps {
  rentals: Rental[];
  onReturnItem: (rental: Rental) => void;
}

export const OverdueAlerts: React.FC<OverdueAlertsProps> = ({ rentals, onReturnItem }) => {
  const overdueRentals = rentals
    .filter(r => r.status === 'Active' && new Date() > r.dueDate)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()); // Most overdue first

  const getDaysOverdue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - dueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSeverityColor = (daysOverdue: number) => {
    if (daysOverdue >= 14) return 'error';
    if (daysOverdue >= 7) return 'warning';
    return 'error';
  };

  if (overdueRentals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <div className="p-1 bg-green-100 rounded-full">
              <AlertTriangle className="h-4 w-4" />
            </div>
            All Items On Track
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">No overdue items. All rentals are within their due dates.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <div className="p-1 bg-red-100 rounded-full">
              <AlertTriangle className="h-4 w-4" />
            </div>
            Overdue Items ({overdueRentals.length})
          </div>
          <Badge variant="error">{overdueRentals.length} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {overdueRentals.map((rental) => {
            const daysOverdue = getDaysOverdue(rental.dueDate);
            return (
              <div key={rental.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{rental.productName}</h4>
                    <p className="text-sm text-gray-600 mb-1">Serial: {rental.productSerialNumber}</p>
                  </div>
                  <Badge variant={getSeverityColor(daysOverdue)}>
                    {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{rental.staffName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {format(rental.dueDate, 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-red-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Location: {rental.storeLocation}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onReturnItem(rental)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Returned
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {overdueRentals.length > 3 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              {overdueRentals.length - 3} more overdue items...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};