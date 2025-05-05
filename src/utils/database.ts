
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Define our database schema
interface VacationSystemDB extends DBSchema {
  users: {
    key: string;
    value: {
      id: string;
      name: string;
      email: string;
      password: string; // Note: In a real app, passwords should be hashed
      role: 'employee' | 'supervisor' | 'admin';
      department: string;
      warName: string;
      rank: string;
      supervisorId?: string;
    };
    indexes: { 'by-email': string };
  };
  vacationRequests: {
    key: string;
    value: {
      id: string;
      userId: string;
      userName: string;
      userWarName: string;
      userRank: string;
      userDepartment: string;
      startDate: string;
      endDate: string;
      reason: string;
      status: 'pending' | 'approved' | 'denied';
      createdAt: string;
      updatedAt: string;
      supervisorId?: string;
      supervisorName?: string;
      supervisorComment?: string;
    };
    indexes: { 'by-userId': string, 'by-supervisorId': string };
  };
  departments: {
    key: string;
    value: {
      id: string;
      name: string;
      createdAt: string;
    };
  };
}

let dbInstance: IDBPDatabase<VacationSystemDB> | null = null;

// Initialize the database
export const initDB = async () => {
  if (!dbInstance) {
    dbInstance = await openDB<VacationSystemDB>('vacation-system-db', 1, {
      upgrade(db) {
        // Create users store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('by-email', 'email', { unique: true });
        }
        
        // Create vacation requests store
        if (!db.objectStoreNames.contains('vacationRequests')) {
          const requestsStore = db.createObjectStore('vacationRequests', { keyPath: 'id' });
          requestsStore.createIndex('by-userId', 'userId');
          requestsStore.createIndex('by-supervisorId', 'supervisorId');
        }
        
        // Create departments store
        if (!db.objectStoreNames.contains('departments')) {
          db.createObjectStore('departments', { keyPath: 'id' });
        }
        
        // Seed initial data (for demo purposes)
        seedInitialData(db);
      }
    });
  }
  
  return dbInstance;
};

// Helper function to get the database instance
export const getDB = async () => {
  if (!dbInstance) {
    return initDB();
  }
  return dbInstance;
};

// Seed initial data (for development/demo purposes)
const seedInitialData = async (db: IDBPDatabase<VacationSystemDB>) => {
  const userStore = db.transaction('users', 'readwrite').objectStore('users');
  const deptStore = db.transaction('departments', 'readwrite').objectStore('departments');
  const requestsStore = db.transaction('vacationRequests', 'readwrite').objectStore('vacationRequests');
  
  // Check if data already exists
  const userCount = await userStore.count();
  
  if (userCount === 0) {
    // Import mock data
    const { MOCK_USERS, MOCK_VACATION_REQUESTS } = await import('@/data/mock-data');
    
    // Add mock users
    for (const user of MOCK_USERS) {
      await userStore.add({
        ...user,
        // Add a mock password for development
        password: 'password123'
      });
    }
    
    // Add mock vacation requests
    for (const request of MOCK_VACATION_REQUESTS) {
      await requestsStore.add(request);
    }
    
    // Add initial departments
    const initialDepartments = [
      {
        id: "1",
        name: "Seção de Informática",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Seção de Pessoal",
        createdAt: new Date().toISOString()
      }
    ];
    
    for (const dept of initialDepartments) {
      await deptStore.add(dept);
    }
  }
};

// User-related functions
export const getUsers = async () => {
  const db = await getDB();
  return db.getAll('users');
};

export const getUserByEmail = async (email: string) => {
  const db = await getDB();
  const tx = db.transaction('users', 'readonly');
  const emailIndex = tx.store.index('by-email');
  return emailIndex.get(email);
};

export const addUser = async (user: Omit<VacationSystemDB['users']['value'], 'id'>) => {
  const db = await getDB();
  const id = crypto.randomUUID();
  return db.add('users', { ...user, id });
};

export const updateUser = async (user: VacationSystemDB['users']['value']) => {
  const db = await getDB();
  return db.put('users', user);
};

export const deleteUser = async (id: string) => {
  const db = await getDB();
  return db.delete('users', id);
};

// Department-related functions
export const getDepartments = async () => {
  const db = await getDB();
  return db.getAll('departments');
};

export const addDepartment = async (name: string) => {
  const db = await getDB();
  const id = crypto.randomUUID();
  return db.add('departments', {
    id,
    name,
    createdAt: new Date().toISOString()
  });
};

export const updateDepartment = async (id: string, name: string) => {
  const db = await getDB();
  const dept = await db.get('departments', id);
  if (dept) {
    return db.put('departments', { ...dept, name });
  }
  throw new Error('Department not found');
};

export const deleteDepartment = async (id: string) => {
  const db = await getDB();
  return db.delete('departments', id);
};

// Vacation request-related functions
export const getVacationRequests = async () => {
  const db = await getDB();
  return db.getAll('vacationRequests');
};

export const getUserVacationRequests = async (userId: string) => {
  const db = await getDB();
  const tx = db.transaction('vacationRequests', 'readonly');
  const userIndex = tx.store.index('by-userId');
  return userIndex.getAll(userId);
};

export const getSupervisorVacationRequests = async (supervisorId: string) => {
  const db = await getDB();
  const tx = db.transaction('vacationRequests', 'readonly');
  const supervisorIndex = tx.store.index('by-supervisorId');
  return supervisorIndex.getAll(supervisorId);
};

export const addVacationRequest = async (request: Omit<VacationSystemDB['vacationRequests']['value'], 'id' | 'createdAt' | 'updatedAt'>) => {
  const db = await getDB();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  
  return db.add('vacationRequests', {
    ...request,
    id,
    createdAt: now,
    updatedAt: now
  });
};

export const updateVacationRequest = async (id: string, updates: Partial<VacationSystemDB['vacationRequests']['value']>) => {
  const db = await getDB();
  const request = await db.get('vacationRequests', id);
  
  if (request) {
    return db.put('vacationRequests', {
      ...request,
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }
  throw new Error('Vacation request not found');
};
