import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Ticket } from '../types/tickets.model';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
<div (click)="toggleSelecionado()"
     class="relative mt-5 p-6 rounded-2xl
            bg-white/10 backdrop-blur-xl border border-white/20
            shadow-lg hover:shadow-xl transition-all cursor-pointer
            hover:scale-[1.01]"
     [ngClass]="{ 'ring-2 ring-emerald-400/70': selecionado }">

  <!-- Check de seleção -->
  <div *ngIf="selecionado"
       class="absolute top-3 right-3 w-6 h-6 bg-emerald-500 text-white rounded-full
              flex items-center justify-center text-sm font-bold shadow-md">
    ✓
  </div>

  <!-- Cabeçalho -->
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
    <div class="flex-1">
      <h3 class="font-semibold text-lg text-black">{{ ticket.titulo }}</h3>
      <p class="text-sm text-black/70 mt-1">{{ ticket.descricao }}</p>
    </div>

    <div class="flex flex-wrap gap-2 justify-start sm:justify-end">
      <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            [ngClass]="{
              'bg-yellow-500/20 text-yellow-500': ticket.status === 'ABERTO',
              'bg-blue-500/20 text-blue-500': ticket.status === 'EM_ANDAMENTO',
              'bg-green-500/20 text-green-500': ticket.status === 'FECHADO'
            }">
        {{ ticket.status }}
      </span>

      <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            [ngClass]="{
              'bg-red-500/20 text-red-500': ticket.prioridade === 'ALTA',
              'bg-orange-500/20 text-orange-500': ticket.prioridade === 'MEDIA',
              'bg-gray-500/20 text-gray-500': ticket.prioridade === 'BAIXA'
            }">
        {{ ticket.prioridade }}
      </span>
    </div>
  </div>

  <!-- Setor e Autor -->
  <div class="flex flex-wrap gap-4 items-center text-sm text-black/70 mt-4">
    <span class="px-3 py-1 rounded-full text-xs font-medium"
          [ngClass]="{
            'bg-blue-500/20 text-blue-500': ticket.setor === 'TI',
            'bg-green-500/20 text-green-500': ticket.setor === 'Financeiro',
            'bg-yellow-500/20 text-yellow-500': ticket.setor === 'RH'
          }">
      {{ ticket.setor }}
    </span>

    <span class="flex items-center gap-2">
      <lucide-icon name="User" class="h-4 w-4 text-black/60"></lucide-icon>
      {{ ticket.abertoPor }}
    </span>

    <span class="flex items-center gap-2">
      <lucide-icon name="MessageSquare" class="h-4 w-4 text-black/60"></lucide-icon>
      {{ ticket.mensagensNaoLidas }} mensagem(s)
    </span>
  </div>

  <!-- Ações -->
  <div class="flex flex-col sm:flex-row gap-3 pt-5">
    <button (click)="verDetalhes.emit(ticket); $event.stopPropagation()"
            class="flex-1 inline-flex items-center justify-center gap-2 h-9 rounded-lg
                   bg-white/15 border border-white/60 text-black text-sm font-medium
                   hover:bg-white/25 transition">
      <lucide-icon name="Eye" class="h-4 w-4"></lucide-icon>
      Ver Detalhes
    </button>

    <!-- Botão dinâmico de status -->
    <button *ngIf="ticket.status !== 'FECHADO'"
            (click)="iniciarOuCancelar($event)"
            class="flex-1 inline-flex items-center justify-center gap-2 h-9 rounded-lg
                   bg-gradient-to-r from-emerald-500 to-green-400 text-white font-medium
                   hover:from-emerald-400 hover:to-green-300 transition">
      {{ ticket.status === 'ABERTO' ? 'Iniciar' : 'Finalizar' }}
    </button>

    <span *ngIf="ticket.status === 'FECHADO'"
          class="flex-1 inline-flex items-center justify-center gap-2 h-9 rounded-lg
                 bg-green-500/30 text-white font-medium text-center">
      Concluído
    </span>
  </div>
</div>

<!-- Toast -->
<div *ngIf="toastMensagem"
     class="fixed bottom-5 right-5 bg-black/80 text-white px-4 py-2 rounded-xl shadow-lg animate-fadeInOut">
  {{ toastMensagem }}
</div>
  `,
  styles: [`
    @keyframes fadeInOut {
      0% { opacity: 0; transform: translateY(10px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(10px); }
    }
    .animate-fadeInOut {
      animation: fadeInOut 3s forwards;
    }
  `]
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;
  @Input() selecionado: boolean = false;
  @Output() selecionadoChange = new EventEmitter<boolean>();
  @Output() verDetalhes = new EventEmitter<Ticket>();
  @Output() alterarStatus = new EventEmitter<{ ticket: Ticket, status: Ticket['status'] }>();

  toastMensagem: string | null = null;

  toggleSelecionado() {
    this.selecionado = !this.selecionado;
    this.selecionadoChange.emit(this.selecionado);
  }

  iniciarOuCancelar(event: Event) {
    event.stopPropagation();
    if (!this.ticket) return;

    if (this.ticket.status === 'ABERTO') {
      this.ticket.status = 'EM_ANDAMENTO';
      this.mostrarToast('Ticket iniciado');
      this.alterarStatus.emit({ ticket: this.ticket, status: 'EM_ANDAMENTO' });
    } else if (this.ticket.status === 'EM_ANDAMENTO') {
      this.ticket.status = 'FECHADO';
      this.mostrarToast('Ticket concluído');
      this.alterarStatus.emit({ ticket: this.ticket, status: 'FECHADO' });
    }
  }

  mostrarToast(mensagem: string) {
    this.toastMensagem = mensagem;
    setTimeout(() => this.toastMensagem = null, 3000); // desaparece após 3s
  }
}
