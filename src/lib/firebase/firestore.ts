import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { Product, Rental } from '@/types';

export const productService = {
  async getAll(): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  },

  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  },

  async update(id: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'products', id));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  },

  async getAvailable(): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('status', '==', 'Available'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting available products:', error);
      return [];
    }
  }
};

export const rentalService = {
  async getAll(): Promise<Rental[]> {
    try {
      const rentalsRef = collection(db, 'rentals');
      const q = query(rentalsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        rentalDate: doc.data().rentalDate.toDate(),
        dueDate: doc.data().dueDate.toDate(),
        returnDate: doc.data().returnDate ? doc.data().returnDate.toDate() : undefined,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Rental[];
    } catch (error) {
      console.error('Error getting rentals:', error);
      return [];
    }
  },

  async getActive(): Promise<Rental[]> {
    try {
      const rentalsRef = collection(db, 'rentals');
      const q = query(rentalsRef, where('status', '==', 'Active'), orderBy('dueDate', 'asc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        rentalDate: doc.data().rentalDate.toDate(),
        dueDate: doc.data().dueDate.toDate(),
        returnDate: doc.data().returnDate ? doc.data().returnDate.toDate() : undefined,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Rental[];
    } catch (error) {
      console.error('Error getting active rentals:', error);
      return [];
    }
  },

  async create(rentalData: Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, 'rentals'), {
        ...rentalData,
        rentalDate: Timestamp.fromDate(rentalData.rentalDate),
        dueDate: Timestamp.fromDate(rentalData.dueDate),
        returnDate: rentalData.returnDate ? Timestamp.fromDate(rentalData.returnDate) : null,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating rental:', error);
      return null;
    }
  },

  async returnItem(rentalId: string, returnDate: Date): Promise<boolean> {
    try {
      const docRef = doc(db, 'rentals', rentalId);
      await updateDoc(docRef, {
        status: 'Returned',
        returnDate: Timestamp.fromDate(returnDate),
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (error) {
      console.error('Error returning item:', error);
      return false;
    }
  },

  async getByProductId(productId: string): Promise<Rental[]> {
    try {
      const rentalsRef = collection(db, 'rentals');
      const q = query(rentalsRef, where('productId', '==', productId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        rentalDate: doc.data().rentalDate.toDate(),
        dueDate: doc.data().dueDate.toDate(),
        returnDate: doc.data().returnDate ? doc.data().returnDate.toDate() : undefined,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      })) as Rental[];
    } catch (error) {
      console.error('Error getting rentals by product:', error);
      return [];
    }
  }
};