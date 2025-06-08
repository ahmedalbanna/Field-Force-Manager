
import type { User, SalesRep, Client, VisitPlan, Manufacturer, PromotionalMaterial, Product } from '@/types';

export const mockUsers: User[] = [
  { uid: 'manager1', email: 'manager@example.com', displayName: 'Alice Manager', role: 'manager', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(), isActive: true, photoUrl: 'https://placehold.co/100x100/EFEFEF/AAAAAA&text=AM' },
  { uid: 'rep1', email: 'rep1@example.com', displayName: 'Bob Rep', role: 'sales_rep', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(), isActive: true, photoUrl: 'https://placehold.co/100x100/EFEFEF/AAAAAA&text=BR' },
  { uid: 'rep2', email: 'rep2@example.com', displayName: 'Charlie Rep', role: 'sales_rep', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(), isActive: true, photoUrl: 'https://placehold.co/100x100/EFEFEF/AAAAAA&text=CR' },
];

export const mockSalesReps: SalesRep[] = [
  { id: 'srep1', userRef: 'rep1', managerRef: 'manager1', territory: 'North', totalVisitsMade: 15, totalVisitsPlanned: 25, user: mockUsers.find(u => u.uid === 'rep1') },
  { id: 'srep2', userRef: 'rep2', managerRef: 'manager1', territory: 'South', totalVisitsMade: 10, totalVisitsPlanned: 20, user: mockUsers.find(u => u.uid === 'rep2') },
];

export const mockManufacturers: Manufacturer[] = [
  { manufacturerId: 'manu1', name: 'MediCorp', logoUrl: 'https://placehold.co/100x50' },
  { manufacturerId: 'manu2', name: 'HealthSolutions Ltd.', logoUrl: 'https://placehold.co/100x50' },
  { manufacturerId: 'manu3', name: 'BioInnovate', logoUrl: 'https://placehold.co/100x50' },
];

export const mockClients: Client[] = [
  { 
    clientId: 'client1', 
    clientName: 'City General Hospital', 
    type: 'hospital_government', 
    address: '123 Main St, Anytown, USA 12345', 
    assignedRepRef: 'rep1',
    assignedRepName: mockSalesReps.find(sr => sr.userRef === 'rep1')?.user?.displayName,
    numDoctors: 50,
    numOperationsBySpecialty: { "Cardiac Surgery": 50, "Orthopedic": 120, "Neurosurgery": 30 },
    influentialPersonnel: [{ name: "Dr. Smith", role: "Head of Cardiology" }, { name: "Ms. Davis", role: "Chief Administrator"}],
    createdAt: new Date(2023, 0, 15).toISOString(),
    email: 'contact@citygeneral.com',
    phoneNumber: '555-1234',
    location: { latitude: 34.0522, longitude: -118.2437 }
  },
  { 
    clientId: 'client2', 
    clientName: 'Dr. Emily White Clinic', 
    type: 'doctor_clinic', 
    address: '456 Oak Ave, Anytown, USA 12345', 
    assignedRepRef: 'rep1',
    assignedRepName: mockSalesReps.find(sr => sr.userRef === 'rep1')?.user?.displayName,
    createdAt: new Date(2023, 2, 10).toISOString(),
    email: 'info@drewhite.com',
    phoneNumber: '555-5678',
    location: { latitude: 34.0522, longitude: -118.2437 }
  },
  { 
    clientId: 'client3', 
    clientName: 'Private Care Hospital', 
    type: 'hospital_private', 
    address: '789 Pine Rd, Anytown, USA 12345', 
    assignedRepRef: 'srep2', // Corrected to match an ID from mockSalesReps
    assignedRepName: mockSalesReps.find(sr => sr.id === 'srep2')?.user?.displayName,
    numDoctors: 30,
    influentialPersonnel: [{ name: "Dr. Jones", role: "Chief Surgeon" }],
    createdAt: new Date(2023, 5, 20).toISOString(),
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
    notes: "Initial discussion about new product line X. Client (Dr. Smith) showed interest in feature Y. Mentioned budget constraints for Q3."
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
    updatedAt: new Date().toISOString(),
    notes: "Follow-up regarding last month's inquiry about product Z. Prepare demo materials."
  },
  { 
    visitId: 'visit3', 
    salesRepRef: 'srep2', // Corrected
    salesRepName: mockSalesReps.find(sr => sr.id === 'srep2')?.user?.displayName, // Corrected
    clientRef: 'client3', 
    clientName: mockClients.find(c => c.clientId === 'client3')?.clientName,
    scheduledDate: yesterday.toISOString(), 
    scheduledTime: '11:00 AM', 
    status: 'completed', 
    notes: 'Product demo of Scanner B was successful. Dr. Jones impressed with imaging quality. Discussed pricing options.', 
    nextSteps: 'Schedule a meeting with purchasing department. Send official quote by EOD.', 
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
    scheduledDate: new Date(new Date().setDate(today.getDate() + 2)).toISOString(), 
    scheduledTime: '09:00 AM', 
    status: 'planned', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
    notes: "Present proposal for product line X. Address budget concerns with financing options."
  },
];

export const mockPromotionalMaterials: PromotionalMaterial[] = [
  { materialId: 'mat1', title: 'Advanced Scanner X1 Brochure', type: 'brochure', fileUrl: 'https://placehold.co/800x1100/EFEFEF/AAAAAA&text=Brochure_X1.pdf', thumbnailUrl: 'https://placehold.co/200x280/EFEFEF/AAAAAA&text=BrochureX1', manufacturerRef: 'manu1', manufacturerName: 'MediCorp', createdAt: new Date().toISOString(), description: 'Detailed brochure for the latest X1 scanner technology, highlighting key features and benefits.' },
  { materialId: 'mat2', title: 'Surgical Tools Catalog 2024', type: 'catalog', fileUrl: 'https://placehold.co/800x1100/EFEFEF/AAAAAA&text=Catalog_2024.pdf', thumbnailUrl: 'https://placehold.co/200x280/EFEFEF/AAAAAA&text=Catalog24', manufacturerRef: 'manu2', manufacturerName: 'HealthSolutions Ltd.', createdAt: new Date().toISOString(), description: 'Comprehensive catalog of all surgical tools offered by HealthSolutions Ltd. for the year 2024.' },
  { materialId: 'mat3', title: 'X1 Device Demo Video', type: 'video', fileUrl: '#video-link1', thumbnailUrl: 'https://placehold.co/300x200/333/FFF&text=X1+Video', manufacturerRef: 'manu1', manufacturerName: 'MediCorp', createdAt: new Date().toISOString(), description: 'Short demonstration video showcasing the operational workflow and unique features of the new X1 device.' },
  { materialId: 'mat4', title: 'New Stent Design Image', type: 'image', fileUrl: 'https://placehold.co/600x400/CCCCCC/333333&text=Stent+Image', thumbnailUrl: 'https://placehold.co/300x200/CCCCCC/333333&text=StentThumb', manufacturerRef: 'manu2', manufacturerName: 'HealthSolutions Ltd.', createdAt: new Date().toISOString(), description: 'High-resolution image of our newly designed coronary stent, model CS-Alpha.' },
];

export const mockProducts: Product[] = [
  { productId: 'prod1', productName: 'X1 Advanced Scanner', price: 120000, currency: 'USD', manufacturerRef: 'manu1', manufacturerName: 'MediCorp', description: 'State-of-the-art medical scanner with AI-assisted diagnostics and improved image resolution.', marketAnalysis: { casesPerHospitalAnnually: { 'client1': 200 }, competitors: [{name: 'Scanner Y-Pro', price: '115000 USD'}, {name: 'Scanner Z-Max', price: '130000 USD'}], otherNotes: "High demand in large hospitals." } },
  { productId: 'prod2', productName: 'Precision Scalpel Set (Titanium)', price: 550, currency: 'USD', manufacturerRef: 'manu2', manufacturerName: 'HealthSolutions Ltd.', description: 'Set of 5 high-precision surgical scalpels made from medical-grade titanium for enhanced durability.', marketAnalysis: { competitors: [{name: 'Scalpel Pro Series', price: '480 USD'}, {name: 'FineCut Blades', price: '600 USD'}]} },
  { productId: 'prod3', productName: 'CardioStent Alpha (Drug-Eluting)', price: 2500, currency: 'USD', manufacturerRef: 'manu1', manufacturerName: 'MediCorp', description: 'Next-generation drug-eluting cardiac stent designed for complex lesions and improved patient outcomes.', marketAnalysis: { casesPerHospitalAnnually: {'client1': 150, 'client3': 80}, otherNotes: "Requires specialized training for deployment."} },
  { productId: 'prod4', productName: 'OrthoPlate System Z2', price: 1500, currency: 'USD', manufacturerRef: 'manu3', manufacturerName: 'BioInnovate', description: 'Advanced orthopedic plating system for complex fractures, made with biocompatible alloy.', marketAnalysis: { competitors: [{name: 'OrthoFix Advanced', price: '1400 USD'}]} },
];

export const getClientById = (clientId: string): Client | undefined => mockClients.find(c => c.clientId === clientId);
export const getVisitById = (visitId: string): VisitPlan | undefined => mockVisitPlans.find(v => v.visitId === visitId);
export const getSalesRepById = (repId: string): SalesRep | undefined => mockSalesReps.find(sr => sr.id === repId);
export const getProductById = (productId: string): Product | undefined => mockProducts.find(p => p.productId === productId);
export const getMaterialById = (materialId: string): PromotionalMaterial | undefined => mockPromotionalMaterials.find(m => m.materialId === materialId);

