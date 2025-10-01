// src/lib/types.ts

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Status = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';

export interface UserRef {
  name: string;
  phone?: string;
}

export interface Occurrence {
  id: string;
  title: string;
  description: string;
  category: string;
  sector: string;
  priority: Priority;
  status: Status;
  location: {
    address: string;
  };
  reportedBy?: UserRef;   // agora existe e é obrigatório
  assignedTo?: UserRef;     // opcional
  createdAt: string;
  updatedAt?: string;
}

export interface OccurrenceFilter {
  search?: string;
  status?: Array<Occurrence['status']>;
  priority?: Array<Occurrence['priority']>;
  category?: string;
  sector?: string;
}
