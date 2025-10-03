import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Ticket, MensagemChat, ArquivoPreview } from '../types/tickets.model';

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
<div class="flex-1 overflow-y-auto px-6 py-4 space-y-5 custom-scrollbar"
     (dragover)="onDragOver($event)" 
     (drop)="onDrop($event)">

  <div *ngFor="let msg of mensagens" class="flex items-start gap-3 group">
    
    <!-- Avatar -->
    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 
                flex items-center justify-center font-semibold text-sm text-white shadow-md">
     {{ msg.autor[0] + (msg.autor.split(' ')[1][0] || '') }}

    </div>
    
    <!-- Conteúdo da mensagem -->
    <div class="flex-1 min-w-0">
      
      <!-- Cabeçalho -->
      <div class="flex items-center gap-2 mb-1">
        <span class="text-sm font-semibold text-white truncate">{{ msg.autor }}</span>
        <span class="text-xs text-white/50">{{ msg.timestamp | date:'dd/MM/yyyy HH:mm' }}</span>
      </div>

      <!-- Arquivos primeiro -->
      <ng-container *ngIf="msg.tipo === 'arquivo' && (msg.arquivos?.length || 0) > 0">
        <div class="flex flex-wrap gap-3 mb-2">
          <div *ngFor="let arquivo of msg.arquivos"
               class="flex flex-col items-center justify-center min-w-[90px] max-w-[90px] 
                      bg-white/10 rounded-lg border border-white/20 p-2 shadow-sm hover:bg-white/20 transition">
            
            <ng-container *ngIf="arquivo.tipo === 'image'; else fileIcon">
              <img [src]="arquivo.preview" alt="{{ arquivo.name }}" 
                   class="w-20 h-20 object-cover rounded-md"/>
            </ng-container>

            <ng-template #fileIcon>
              <lucide-icon name="File" class="w-8 h-8 text-white/80"></lucide-icon>
            </ng-template>

            <span class="text-[11px] text-white truncate text-center mt-1 w-full"
                  [title]="arquivo.name">
              {{ arquivo.name }}
            </span>
          </div>
        </div>
      </ng-container>

      <!-- Texto da mensagem (sempre depois do arquivo, se existir) -->
      <ng-container *ngIf="msg.conteudo && msg.conteudo.trim()">
        <div class="inline-block max-w-[80%] p-3 rounded-lg bg-white/10 
                    text-white/90 text-sm shadow-sm backdrop-blur-sm border border-white/20">
          {{ msg.conteudo }}
        </div>
      </ng-container>

    </div>
  </div>



      <!-- Preview de arquivos -->
      <div *ngIf="arquivos.length > 0" class="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
        <h4 class="text-white text-sm mb-2 font-medium">Arquivos adicionados:</h4>
        <div class="flex gap-3 overflow-x-auto py-2 snap-x snap-mandatory">
          <div *ngFor="let arquivo of arquivos"
               class="flex flex-col items-center justify-center min-w-[90px] max-w-[90px] bg-white/20 rounded-xl border border-white/30 p-2 relative shadow-inner hover:shadow-lg transition-transform transform hover:scale-105 snap-start">

            <!-- Miniatura ou ícone por tipo -->
            <ng-container [ngSwitch]="arquivo.tipo">
              <img *ngSwitchCase="'image'" [src]="arquivo.preview" alt="{{ arquivo.name }}" 
                   class="w-16 h-16 object-cover rounded-lg border border-white/20 shadow-sm"/>
              <div *ngSwitchCase="'pdf'" class="w-16 h-16 flex items-center justify-center bg-red-500 rounded-lg text-white font-bold text-lg shadow-sm">PDF</div>
              <div *ngSwitchCase="'word'" class="w-16 h-16 flex items-center justify-center bg-blue-600 rounded-lg text-white font-bold text-lg shadow-sm">DOC</div>
              <div *ngSwitchCase="'excel'" class="w-16 h-16 flex items-center justify-center bg-green-600 rounded-lg text-white font-bold text-lg shadow-sm">XLS</div>
              <div *ngSwitchCase="'ppt'" class="w-16 h-16 flex items-center justify-center bg-orange-600 rounded-lg text-white font-bold text-lg shadow-sm">PPT</div>
              <lucide-icon *ngSwitchDefault name="File" class="w-8 h-8 text-white/90"></lucide-icon>
            </ng-container>

           <!-- Nome do arquivo com tooltip ajustado para nomes longos -->
<span 
  class="text-xs text-white text-center mt-1 w-full overflow-hidden whitespace-nowrap overflow-ellipsis" 
  [title]="arquivo.name">
  {{ arquivo.name }}
</span>


            <!-- Botão remover -->
            <button (click)="removerArquivo(arquivo)"
                    class="absolute top-1 right-1 text-red-400 hover:text-red-600 bg-white/10 rounded-full p-1 opacity-0 hover:opacity-100 transition">
              <lucide-icon name="Trash2" class="w-4 h-4"></lucide-icon>
            </button>
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
      
      <button type="button" (click)="fileInput.click()" class="p-2 rounded-md hover:bg-white/20 transition border border-white/20">
        <lucide-icon name="Paperclip" class="h-5 w-5 text-white"></lucide-icon>
        <input #fileInput type="file" multiple hidden (change)="onFileSelected($event)">
      </button>

      <button type="button"
              [disabled]="!novaMensagem.trim() && arquivos.length === 0"
              (click)="enviarMensagem()"
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
  @Output() mensagemEnviada = new EventEmitter<MensagemChat>();
  arquivos: ArquivoPreview[] = [];

  // Detecta tipo do arquivo
  private detectarTipo(file: File): ArquivoPreview['tipo'] {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx'].includes(ext)) return 'excel';
    if (['ppt', 'pptx'].includes(ext)) return 'ppt';
    return 'outro';
  }

  hasArquivos(msg: MensagemChat): boolean {
  return msg.tipo === 'arquivo' && !!msg.arquivos && msg.arquivos.length > 0;
}


  enviarMensagem() {
    if (!this.novaMensagem.trim() && this.arquivos.length === 0) return;

    const novaMsg: MensagemChat = this.arquivos.length > 0
      ? {
        autor: 'Você',
        tipo: 'arquivo',
        timestamp: new Date(),
        arquivos: [...this.arquivos]
      }
      : {
        autor: 'Você',
        tipo: 'texto',
        timestamp: new Date(),
        conteudo: this.novaMensagem
      };

    this.mensagemEnviada.emit(novaMsg);

    // limpar campos
    this.novaMensagem = '';
    this.arquivos = [];
  }

  // Chamado no input file
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.adicionarArquivos(input.files);
    input.value = ''; // limpa o input
  }

  adicionarArquivos(files: FileList) {
    Array.from(files).forEach(file => {
      const tipo = this.detectarTipo(file);
      const arquivo: ArquivoPreview = { file, name: file.name, tipo };

      if (tipo === 'image') {
        const reader = new FileReader();
        reader.onload = () => arquivo.preview = reader.result as string;
        reader.readAsDataURL(file);
      }

      this.arquivos.push(arquivo);
    });
  }

  removerArquivo(arquivo: ArquivoPreview) {
    this.arquivos = this.arquivos.filter(a => a !== arquivo);
  }

  isImage(arquivo: ArquivoPreview) {
    return arquivo.tipo === 'image';
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) this.adicionarArquivos(event.dataTransfer.files);
  }


}
