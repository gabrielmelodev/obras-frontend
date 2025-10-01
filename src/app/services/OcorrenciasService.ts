import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Ocorrencia {
  id: number;
  setor: string;
  descricao: string;
  solicitante: string;
  categoria: string;
  status: 'PENDENTE_APROVACAO' | 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO';
  lat: number;
  lng: number;
  selecionado?: boolean;
}

@Injectable({ providedIn: 'root' })
export class OcorrenciasService {
  private _ocorrencias = new BehaviorSubject<Ocorrencia[]>([
    { id: 1, descricao: 'Queda de energia', setor: 'Infraestrutura', solicitante: 'Maria', categoria: 'Infraestrutura', status: 'ABERTO', lat: -15.530, lng: -47.410 },
    { id: 2, descricao: 'Alagamento na rua X', setor: 'Clima', solicitante: 'João', categoria: 'Clima', status: 'EM_ANDAMENTO', lat: -15.525, lng: -47.415 },
    { id: 3, descricao: 'Incêndio em galpão', setor: 'Segurança', solicitante: 'Ana', categoria: 'Segurança', status: 'FINALIZADO', lat: -15.528, lng: -47.412 }
  ]);

  ocorrencias$ = this._ocorrencias.asObservable();

  atualizarOcorrencias(novas: Ocorrencia[]) {
    this._ocorrencias.next(novas);
  }
}
