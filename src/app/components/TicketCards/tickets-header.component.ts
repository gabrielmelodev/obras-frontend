import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 sm:gap-0
            bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-lg
            [box-shadow:0_8px_32px_rgba(31,38,135,0.25)]">

  <!-- Títulos -->
  <div>
    <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-black drop-shadow-sm">{{ title }}</h1>
    <p class="text-sm text-black/70 mt-1">{{ subtitle }}</p>
  </div>

  <!-- Botões -->
  <div class="flex flex-wrap gap-2 justify-start sm:justify-end">
    <button (click)="exportar.emit()"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-lg 
                   bg-white/20 backdrop-blur-md border border-white/30 text-black text-sm font-medium shadow-sm
                   hover:bg-white/30 transition">
      <lucide-icon name="SendHorizontal" class="h-4 w-4"></lucide-icon> Exportar
    </button>

    <button (click)="novo.emit()"
            class="inline-flex items-center gap-2 h-9 px-4 rounded-lg 
                   bg-gradient-to-r from-green-500/80 to-emerald-400/80 text-black font-medium shadow-md
                   hover:from-green-400/90 hover:to-emerald-300/90 transition">
      <lucide-icon name="Plus" class="h-4 w-4"></lucide-icon> Novo Ticket
    </button>
  </div>
</div>
  `
})
export class TicketsHeaderComponent {
  @Input() title = 'Sistema de Tickets';
  @Input() subtitle = 'Gerencie solicitações de suporte e comunicação';

  @Output() exportar = new EventEmitter<void>();
  @Output() novo = new EventEmitter<void>();
}
