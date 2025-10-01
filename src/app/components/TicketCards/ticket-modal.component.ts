import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Ticket, MensagemChat } from '../types/tickets.model';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
<div *ngIf="ticket" 
     class="fixed inset-0 bg-neutral-600/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
  
  <div class="relative w-full max-w-3xl h-[80vh] flex flex-col rounded-2xl overflow-hidden
              bg-white/30 backdrop-blur-2xl shadow-2xl border border-white/40
              [box-shadow:0_8px_32px_rgba(31,38,135,0.37)]
              [background:linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.05))]">

    <!-- Glow Border -->
    <div class="absolute inset-0 rounded-2xl border border-white/20"></div>

    <!-- Botão Fechar -->
    <button (click)="fechar.emit()" 
            class="absolute top-4 right-4 text-neutral-200 hover:text-red-400 transition">
      <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M18 6 6 18"></path>
        <path d="M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Cabeçalho -->
    <div class="flex mt-6 items-start justify-between px-6 pb-4 border-b border-white/20">
      <div>
        <h2 class="font-semibold text-xl text-white drop-shadow-sm">{{ ticket.titulo }}</h2>
        <p class="text-sm text-white/80">Ticket #{{ ticket.id }} • Criado por {{ ticket.abertoPor }}</p>
      </div>
      <span class="inline-flex mr-10 items-center justify-center rounded-full px-3 py-1 text-xs font-medium shadow-sm
                  bg-white/20 backdrop-blur-md border border-white/30 text-white">
        {{ ticket.status }}
      </span>
    </div>

    <!-- Mensagens -->
    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
      <div *ngFor="let msg of mensagens" class="flex gap-3">
        <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-semibold text-sm text-white shadow-md">
          {{ msg.autor[0] + (msg.autor.split(' ')[1][0] || '') }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm font-medium text-white">{{ msg.autor }}</span>
            <span class="text-xs text-white/60">{{ msg.timestamp | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
          <div class="p-3 rounded-lg bg-white/20 text-white/90 text-sm shadow-sm backdrop-blur-sm border border-white/30">
            {{ msg.conteudo }}
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="p-4 border-t border-white/20 flex gap-2 bg-white/10 backdrop-blur-md">
      <input type="text"
             placeholder="Digite sua mensagem..."
             [ngModel]="novaMensagem"
             (ngModelChange)="novaMensagem = $event; novaMensagemChange.emit($event)"
             class="flex-1 rounded-lg px-3 py-2 text-sm bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/50 outline-none shadow-sm focus:ring-2 focus:ring-green-300"/>
      
      <button type="button" class="p-2 rounded-md hover:bg-white/20 transition border border-white/20">
        <lucide-icon name="Paperclip" class="h-5 w-5 text-white"></lucide-icon>
      </button>

      <button type="button"
              [disabled]="!novaMensagem.trim()"
              (click)="enviar.emit()"
              class="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-md transition
                     disabled:opacity-40 disabled:cursor-not-allowed
                     bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300">
        Enviar
      </button>
    </div>
  </div>
</div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 10px;
    }
  `]
})
export class TicketModalComponent {
  @Input() ticket: Ticket | null = null;
  @Input() mensagens: MensagemChat[] = [];
  @Input() novaMensagem: string = '';

  @Output() enviar = new EventEmitter<void>();
  @Output() fechar = new EventEmitter<void>();
  @Output() novaMensagemChange = new EventEmitter<string>();
}
