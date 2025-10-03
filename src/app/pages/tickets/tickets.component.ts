import { Component, OnInit } from '@angular/core';
import { Ticket, MensagemChat } from '../../components/types/tickets.model';
import { TicketCardComponent } from '../../components/TicketCards/ticket-card.component';
import { TicketModalComponent } from '../../components/TicketCards/ticket-modal.component';
import { TicketsHeaderComponent } from '../../components/TicketCards/tickets-header.component';
import { TicketsFiltersComponent } from '../../components/TicketCards/tickets-filters.component';
import { TicketsOrderComponent } from '../../components/TicketCards/tickets-order.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  imports: [
    CommonModule,
    TicketCardComponent,
    TicketsOrderComponent,
    TicketModalComponent,
    TicketsHeaderComponent,
    FormsModule,
    TicketsFiltersComponent
  ],
  standalone: true
})
export class TicketsComponent implements OnInit {
  
  ticketsMock: Ticket[] = [
    { id: 1, titulo: 'Ticket 1', descricao: 'Descrição 1', abertoPor: 'Usuário A', prioridade: 'ALTA', status: 'ABERTO', selecionado: false, mensagensNaoLidas: 0, setor: 'TI' },
    { id: 2, titulo: 'Ticket 2', descricao: 'Descrição 2', abertoPor: 'Usuário B', prioridade: 'MEDIA', status: 'EM_ANDAMENTO', selecionado: false, mensagensNaoLidas: 2, setor: 'Financeiro' },
    { id: 3, titulo: 'Ticket 3', descricao: 'Descrição 3', abertoPor: 'Usuário C', prioridade: 'BAIXA', status: 'FECHADO', selecionado: false, mensagensNaoLidas: 0, setor: 'RH' },
  ];

  ticketSelecionado: Ticket | null = null;
  mensagens: MensagemChat[] = [];
  novaMensagem: string = '';

  selecionarTodos = false;
  ordenarPor = 'data';
  ordem = 'desc';
  filtroTitulo = '';

  ngOnInit() {}

  // Resumo dinâmico
  get totalTickets() { return this.ticketsMock.length; }
  get totalAbertos() { return this.ticketsMock.filter(t => t.status === 'ABERTO').length; }
  get totalEmAndamento() { return this.ticketsMock.filter(t => t.status === 'EM_ANDAMENTO').length; }
  get totalResolvidos() { return this.ticketsMock.filter(t => t.status === 'FECHADO').length; }
  get totalFechados() { return this.ticketsMock.filter(t => t.status === 'FECHADO').length; }

  ticketsFiltrados(): Ticket[] {
    let list = [...this.ticketsMock];
    if (this.filtroTitulo) {
      list = list.filter(t => t.titulo.toLowerCase().includes(this.filtroTitulo.toLowerCase()));
    }
    return list;
  }

  toggleSelecionarTodos() {
    if (!this.ticketsMock.length) return;
    this.ticketsMock.forEach(t => t.selecionado = this.selecionarTodos);
  }

  verDetalhes(ticket: Ticket) {
    this.ticketSelecionado = ticket;
    this.mensagens = [
      { autor: 'Usuário A', tipo:'texto', conteudo: 'Mensagem 1', timestamp: new Date() },
      { autor: 'Usuário B', tipo: 'texto', conteudo: 'Mensagem 2', timestamp: new Date() },
    ];
  }

  // Alterar status de um ticket e mostrar toast
  onAlterarStatus(event: { ticket: Ticket, status: Ticket['status'] }) {
    const { ticket, status } = event;
    ticket.status = status;

    // Toast simples
    if (status === 'EM_ANDAMENTO') {
      this.mostrarToast(`Ticket "${ticket.titulo}" iniciado!`);
    } else if (status === 'FECHADO') {
      this.mostrarToast(`Ticket "${ticket.titulo}" concluído!`);
    }
  }

  mostrarToast(mensagem: string) {
    const toast = document.createElement('div');
    toast.textContent = mensagem;
    toast.className = 'fixed bottom-5 right-5 bg-black/80 text-white px-4 py-2 rounded shadow-lg animate-fadeInOut';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

enviarMensagem() {
  if (!this.novaMensagem.trim() || !this.ticketSelecionado) return;

  this.mensagens.push({
    autor: 'Você',
    tipo: 'texto',                 // <-- obrigatório
    conteudo: this.novaMensagem.trim(),
    timestamp: new Date()
  });

  this.novaMensagem = '';
}

  fecharModal() {
    this.ticketSelecionado = null;
    this.mensagens = [];
    this.novaMensagem = '';
  }

  modalNovoTicket = false;

  novoTicket = {
    titulo: '',
    descricao: '',
    prioridade: ''
  };

  abrirModalNovoTicket() {
    this.modalNovoTicket = true;
  }

  criarTicket() {
    console.log("Novo Ticket:", this.novoTicket);
 
    this.modalNovoTicket = false;
    this.novoTicket = { titulo: '', descricao: '', prioridade: '' };
  }
}
