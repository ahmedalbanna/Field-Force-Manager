import type { User, SalesRep, Client, VisitPlan, Manufacturer, PromotionalMaterial, Product } from '@/types';

export const mockUsers: User[] = [
  { uid: 'manager1', email: 'manager@example.com', displayName: 'Alice Manager', role: 'manager', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(), isActive: true, photoUrl: 'https://placehold.co/100x100' },
  { uid: 'rep1', email: 'rep1@example.com', displayName: 'Bob Rep', role: 'sales_rep', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(), isActive: true, photoUrl: 'https://placehold.co/100x100' },
  { uid: 'rep2', email: 'rep2@example.com', displayName: 'Charlie Rep', role: 'sales_rep', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(), isActive: true, photoUrl: 'https://placehold.co/100x100' },
];

export const mockSalesReps: SalesRep[] = [
  { id: 'rep1', userRef: 'rep1', managerRef: 'manager1', territory: 'North', totalVisitsMade: 15, totalVisitsPlanned: 25, user: mockUsers.find(u => u.uid === 'rep1') },
  { id: 'rep2', userRef: 'rep2', managerRef: 'manager1', territory: 'South', totalVisitsMade: 10, totalVisitsPlanned: 20, user: mockUsers.find(u => u.uid === 'rep2') },
];

export const mockManufacturers: Manufacturer[] = [
  { manufacturerId: 'manu1', name: 'MediCorp', logoUrl: 'https://placehold.co/100x50' },
  { manufacturerId: 'manu2', name: 'HealthSolutions Ltd.', logoUrl: 'https://placehold.co/100x50' },
];

export const mockClients: Client[] = [
  { 
    clientId: 'client1', 
    clientName: 'City General Hospital', 
    type: 'hospital_government', 
    address: '123 Main St, Anytown', 
    assignedRepRef: 'rep1',
    assignedRepName: mockSalesReps.find(sr => sr.userRef === 'rep1')?.user?.displayName,
    numDoctors: 50,
    numOperationsBySpecialty: { "Cardiac Surgery": 50, "Orthopedic": 120 },
    influentialPersonnel: [{ name: "Dr. Smith", role: "Head of Cardiology" }],
    createdAt: new Date().toISOString(),
    email: 'contact@citygeneral.com',
    phoneNumber: '555-1234',
    location: { latitude: 34.0522, longitude: -118.2437 }
  },
  { 
    clientId: 'client2', 
    clientName: 'Dr. Emily White Clinic', 
    type: 'doctor_clinic', 
    address: '456 Oak Ave, Anytown', 
    assignedRepRef: 'rep1',
    assignedRepName: mockSalesReps.find(sr => sr.userRef === 'rep1')?.user?.displayName,
    createdAt: new Date().toISOString(),
    email: 'info@drewhite.com',
    phoneNumber: '555-5678',
    location: { latitude: 34.0522, longitude: -118.2437 }
  },
  { 
    clientId: 'client3', 
    clientName: 'Private Care Hospital', 
    type: 'hospital_private', 
    address: '789 Pine Rd, Anytown', 
    assignedRepRef: 'rep2',
    assignedRepName: mockSalesReps.find(sr => sr.userRef === 'rep2')?.user?.displayName,
    numDoctors: 30,
    influentialPersonnel: [{ name: "Dr. Jones", role: "Chief Surgeon" }],
    createdAt: new Date().toISOString(),
    email: 'admin@privatecare.com',
    phoneNumber: '555-8765',
    location: { latitude: 34.0522, longitude: -118.2437 }
  },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() -1);

export const mockVisitPlans: VisitPlan[] = [
  { 
    visitId: 'visit1', 
    salesRepRef: 'rep1', 
    salesRepName: mockSalesReps.find(sr => sr.userRef === 'rep1')?.user?.displayName,
    clientRef: 'client1', 
    clientName: mockClients.find(c => c.clientId === 'client1')?.clientName,
    scheduledDate: today.toISOString(), 
    scheduledTime: '10:00 AM', 
    status: 'planned', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
    notes: "Initial discussion about new product line. Client showed interest in X feature."
  },
  { 
    visitId: 'visit2', 
    salesRepRef: 'rep1', 
    salesRepName: mockSalesReps.find(sr => sr.userRef === 'rep1')?.user?.displayName,
    clientRef: 'client2', 
    clientName: mockClients.find(c => c.clientId === 'client2')?.clientName,
    scheduledDate: tomorrow.toISOString(), 
    scheduledTime: '02:00 PM', 
    status: 'planned', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    visitId: 'visit3', 
    salesRepRef: 'rep2', 
    salesRepName: mockSalesReps.find(sr => sr.userRef === 'rep2')?.user?.displayName,
    clientRef: 'client3', 
    clientName: mockClients.find(c => c.clientId === 'client3')?.clientName,
    scheduledDate: yesterday.toISOString(), 
    scheduledTime: '11:00 AM', 
    status: 'completed', 
    notes: 'Product demo was successful. Sent follow-up email with brochure.', 
    nextSteps: 'Schedule a meeting with purchasing department.', 
    checkInTime: yesterday.toISOString(), 
    checkOutTime: new Date(new Date(yesterday).setHours(yesterday.getHours()+1)).toISOString(),
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
   { 
    visitId: 'visit4', 
    salesRepRef: 'rep1', 
    salesRepName: mockSalesReps.find(sr => sr.userRef === 'rep1')?.user?.displayName,
    clientRef: 'client1', 
    clientName: mockClients.find(c => c.clientId === 'client1')?.clientName,
    scheduledDate: new Date(today.setDate(today.getDate() + 2)).toISOString(), 
    scheduledTime: '09:00 AM', 
    status: 'planned', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
];

export const mockPromotionalMaterials: PromotionalMaterial[] = [
  { materialId: 'mat1', title: 'Advanced Scanner Brochure', type: 'brochure', fileUrl: 'https://placehold.co/800x1100/EFEFEF/AAAAAA&text=Brochure.pdf', thumbnailUrl: 'https://placehold.co/200x280/EFEFEF/AAAAAA&text=Brochure', manufacturerRef: 'manu1', manufacturerName: 'MediCorp', createdAt: new Date().toISOString(), description: 'Latest scanner technology.' },
  { materialId: 'mat2', title: 'Surgical Tools Catalog', type: 'catalog', fileUrl: 'https://placehold.co/800x1100/EFEFEF/AAAAAA&text=Catalog.pdf', thumbnailUrl: 'https://placehold.co/200x280/EFEFEF/AAAAAA&text=Catalog', manufacturerRef: 'manu2', manufacturerName: 'HealthSolutions Ltd.', createdAt: new Date().toISOString(), description: 'Comprehensive catalog of surgical tools.' },
  { materialId: 'mat3', title: 'Product Demo Video', type: 'video', fileUrl: '#', thumbnailUrl: 'https://placehold.co/300x200/333/FFF&text=Video+Placeholder', manufacturerRef: 'manu1', manufacturerName: 'MediCorp', createdAt: new Date().toISOString(), description: 'Demonstration of the new X1 device.' },
  { materialId: 'mat4', title: 'New Stent Image', type: 'image', fileUrl: 'https://placehold.co/600x400', thumbnailUrl: 'https://placehold.co/300x200', manufacturerRef: 'manu2', manufacturerName: 'HealthSolutions Ltd.', createdAt: new Date().toISOString(), description: 'High-resolution image of our new stent.' },
];

export const mockProducts: Product[] = [
  { productId: 'prod1', productName: 'X1 Advanced Scanner', price: 120000, currency: 'USD', manufacturerRef: 'manu1', manufacturerName: 'MediCorp', description: 'State-of-the-art medical scanner.', marketAnalysis: { casesPerHospitalAnnually: { 'client1': 20 }, competitors: [{name: 'Scanner Y', price: '115000'}, {name: 'Scanner Z', price: '130000'}] } },
  { productId: 'prod2', productName: 'Precision Scalpel Set', price: 500, currency: 'USD', manufacturerRef: 'manu2', manufacturerName: 'HealthSolutions Ltd.', description: 'Set of high-precision surgical scalpels.', marketAnalysis: { competitors: [{name: 'Scalpel Pro', price: '480'}]} },
  { productId: 'prod3', productName: 'Cardio Stent Alpha', price: 2500, currency: 'USD', manufacturerRef: 'manu1', manufacturerName: 'MediCorp', description: 'Next-generation cardiac stent.' },
];

export const getClientById = (clientId: string): Client | undefined => mockClients.find(c => c.clientId === clientId);
export const getVisitById = (visitId: string): VisitPlan | undefined => mockVisitPlans.find(v => v.visitId === visitId);
export const getSalesRepById = (repId: string): SalesRep | undefined => mockSalesReps.find(sr => sr.id === repId);

