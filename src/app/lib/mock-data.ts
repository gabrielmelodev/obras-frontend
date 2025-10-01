// src/lib/mock-data.ts (exemplo)
import type { Occurrence } from './types';

export const mockOccurrences: Occurrence[] = [
  {
    id: '1',
    title: 'Queda de energia',
    description: 'Apagão no setor administrativo',
    category: 'Infraestrutura',
    sector: 'Financeiro',
    priority: 'HIGH',
    status: 'PENDING',
    location: { address: 'Prédio Central - Andar 2' },
    reportedBy: { name: 'Maria Silva', phone: '11 99999-0000' },
    assignedTo: { name: 'João Souza' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // ...
];
