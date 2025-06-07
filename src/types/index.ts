export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  role: 'manager' | 'sales_rep';
  phoneNumber?: string;
  createdAt: string; // ISO Date string
  lastLogin: string; // ISO Date string
  isActive: boolean;
}

export interface SalesRep {
  id: string; // Added for easier mapping if not using userRef as primary key in lists
  userRef: string; // User UID
  managerRef?: string; // User UID of manager
  employeeId?: string;
  territory?: string;
  totalVisitsMade: number;
  totalVisitsPlanned: number;
  user?: User; // Populated user data
}

export interface Client {
  clientId: string;
  clientName: string;
  type: 'hospital_government' | 'hospital_private' | 'doctor_clinic';
  address: string;
  location?: LatLng;
  phoneNumber?: string;
  email?: string;
  assignedRepRef: string; // User UID of assigned SalesRep
  assignedRepName?: string; // For display
  numDoctors?: number;
  numOperationsBySpecialty?: Record<string, number>;
  influentialPersonnel?: Array<{ name: string; role: string }>;
  createdAt: string; // ISO Date string
}

export interface VisitPlan {
  visitId: string;
  salesRepRef: string; // User UID
  salesRepName?: string; // For display
  clientRef: string; // Client ID
  clientName?: string; // For display
  scheduledDate: string; // ISO Date string
  scheduledTime: string; // e.g., "10:00 AM"
  status: 'planned' | 'completed' | 'postponed' | 'cancelled';
  reason?: string;
  notes?: string;
  nextSteps?: string;
  checkInLocation?: LatLng;
  checkInTime?: string; // ISO Date string
  checkOutTime?: string; // ISO Date string
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface Manufacturer {
  manufacturerId: string;
  name: string;
  logoUrl?: string;
}

export interface PromotionalMaterial {
  materialId: string;
  title: string;
  description?: string;
  type: 'catalog' | 'brochure' | 'image' | 'video';
  fileUrl: string;
  thumbnailUrl?: string;
  manufacturerRef: string; // Manufacturer ID
  manufacturerName?: string; // For display
  createdAt: string; // ISO Date string
}

export interface Product {
  productId: string;
  productName: string;
  description?: string;
  price: number;
  currency: string;
  manufacturerRef: string; // Manufacturer ID
  manufacturerName?: string; // For display
  marketAnalysis?: {
    casesPerHospitalAnnually?: Record<string, number>; // key: clientId, value: count
    competitors?: Array<{ name: string; price: string }>;
    otherNotes?: string;
  };
}
