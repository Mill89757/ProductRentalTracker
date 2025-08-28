'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Filter, RefreshCw, Download } from 'lucide-react';

interface DashboardFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  locations: string[];
  loading?: boolean;
  showDateRange?: boolean;
  statusOptions?: { value: string; label: string }[];
}

export interface FilterState {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  location: string;
  status: string;
  search?: string;
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  onFilterChange,
  locations,
  loading = false,
  showDateRange = true,
  statusOptions,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      startDate: '',
      endDate: ''
    },
    location: '',
    status: '',
    search: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (key: 'startDate' | 'endDate', value: string) => {
    const newDateRange = { ...filters.dateRange, [key]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      dateRange: { startDate: '', endDate: '' },
      location: '',
      status: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.location || filters.status || filters.search || filters.dateRange.startDate || filters.dateRange.endDate;

  const locationOptions = [
    ...locations.map(location => ({ value: location, label: location }))
  ];

  const defaultStatusOptions = [
    { value: 'Available', label: 'Available' },
    { value: 'Rented Out', label: 'Rented Out' },
    { value: 'Active', label: 'Active Rentals' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Returned', label: 'Returned' }
  ];

  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {hasActiveFilters && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {[
                  filters.location && 'Location',
                  filters.status && 'Status',
                  filters.search && 'Search',
                  (filters.dateRange.startDate || filters.dateRange.endDate) && 'Date Range'
                ].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'} Filters
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className={`grid gap-4 transition-all duration-200 ${
          isExpanded ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-4'
        }`}>
          {/* Search */}
          <Input
            type="text"
            placeholder="Search by product name"
            value={filters.search ?? ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="text-sm"
          />
          {/* Date Range */}
          {showDateRange && (
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Start Date"
                value={filters.dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="text-sm"
              />
              <Input
                type="date"
                placeholder="End Date"
                value={filters.dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="text-sm"
              />
            </div>
          )}

          {/* Location Filter */}
          <Select
            options={locationOptions}
            value={filters.location}
            placeholderOption="Select a location"
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="text-sm"
          />

          {/* Status Filter */}
          <Select
            options={statusOptions ?? defaultStatusOptions}
            value={filters.status}
            placeholderOption="Select a status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="text-sm"
          />

          {/* Export Button (when expanded) */}
          {isExpanded && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Download className="h-3 w-3" />
              Export Data
            </Button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        {isExpanded && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('status', 'Overdue')}
              className="text-xs"
            >
              Show Overdue
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateRangeChange('startDate', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
              className="text-xs"
            >
              Last 7 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDateRangeChange('startDate', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}
              className="text-xs"
            >
              Last 30 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('status', 'Available')}
              className="text-xs"
            >
              Available Only
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};