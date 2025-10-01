import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Phone, Clock, Edit3, MoreHorizontal } from 'lucide-angular';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
<div (click)="toggleCheck()" 
     class="relative rounded-xl border bg-white border-gray-300 p-5 shadow-sm hover:shadow-lg transition cursor-pointer"
     [class.border-green-600]="checked"
     [class.bg-green-200]="checked">

    <!-- Ícone de check no canto superior direito -->
    <div *ngIf="checked" class="absolute top-2 right-2 w-5 h-5 border-green-600 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
        ✓
    </div>

    <!-- Avatar e informações -->
    <div class="flex items-center gap-4 mb-3">
        <div class="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-800 font-bold">
            {{ iniciais }}
        </div>
        <div class="flex flex-col">
            <div class="flex items-center gap-2">
                <h3 class="font-semibold">{{ name }}</h3>
                <span *ngIf="status==='ATIVO'" class="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Ativo</span>
                <span *ngIf="status==='INATIVO'" class="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">Inativo</span>
                <span class="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">{{ role }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ email }}</p>
        </div>
    </div>

    <!-- Detalhes -->
    <div class="flex flex-col gap-1 text-sm text-gray-600 mb-3">
        <div class="flex items-center gap-2"><i lucideIcon="Phone" class="w-4 h-4"></i>{{ phone || '—' }}</div>
        <div class="flex items-center gap-2"><i lucideIcon="Clock" class="w-4 h-4"></i>{{ department || '—' }}</div>
        
    </div>

    <!-- Ações -->
    <div class="flex gap-2 mt-2">
        <button (click)="editar($event)" class="flex-1 flex items-center justify-center gap-1 border-green-600 rounded-md px-2 py-1 bg-green-100 hover:bg-gray-100">
            <i lucideIcon="Edit3" class="w-4 h-4"></i> Editar
        </button>
        
    </div>
</div>

  `,
  styles: [``]
})
export class UserCardComponent {
  @Input() name!: string;
  @Input() email!: string;
  @Input() phone?: string;
  @Input() department?: string;
  @Input() role!: string;
  @Input() status: 'ATIVO' | 'INATIVO' = 'ATIVO';
  @Input() iniciais: string = '';
  @Input() createdAt: string = '';
  @Input() lastAccess: string = '';
  @Input() checked: boolean = false; //
  @Output() checkChange = new EventEmitter<boolean>();
  @Output() editarClick = new EventEmitter<void>();
  @Output() acoesClick = new EventEmitter<void>();



  toggleCheck() {
    this.checked = !this.checked;
    this.checkChange.emit(this.checked);
  }

  editar(event?: MouseEvent) {
    event?.stopPropagation(); // impede de ativar o toggle ao clicar no botão
    this.editarClick.emit();
  }

  getIniciais(nome: string): string {
  return nome.split(' ').map(n => n[0]).join('');
}

  abrirAcoes(event?: MouseEvent) {
    event?.stopPropagation();
    this.acoesClick.emit();
  }
}
