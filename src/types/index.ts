export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  serialNumber: string;
  status: 'Available' | 'Rented Out';
  storeLocation: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rental {
  id: string;
  productId: string;
  productName: string;
  productSerialNumber: string;
  staffName: string;
  storeLocation: string;
  rentalDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'Active' | 'Returned';
  createdAt: Date;
  updatedAt: Date;
}