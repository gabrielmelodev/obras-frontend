export interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  abertoPor: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  status: 'ABERTO' | 'EM_ANDAMENTO' | 'FECHADO';
  selecionado: boolean;
  mensagensNaoLidas: number;
  setor: string;
}


export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  status: 'ATIVO' | 'INATIVO'; 
  telefone: string;
  setor: string;
  dataCriacao?: string;   
  ultimoAcesso?: string;  
}


export interface MensagemChat {
  autor: string;
  conteudo: string;
  timestamp: Date;
}

export interface AlterarStatusEvent {
  ticket: Ticket;
  status: Ticket['status'];
}

type TemaMapa = 'Padrão' | 'Escuro' | 'Claro' | 'Satélite';