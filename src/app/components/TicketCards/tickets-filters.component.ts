import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="bg-white shadow-sm rounded-lg p-4 mb-6 border border-gray-200">
  <label for="search" class="block text-sm font-medium text-gray-700">Buscar</label>
  
  <input id="search"
         [(ngModel)]="filtro"
         (ngModelChange)="filtroChange.emit($event)"
         placeholder="Buscar por título ou descrição..."
         class="mt-2 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring focus:ring-blue-200 
                sm:text-sm px-3 py-2 outline-none" />
</div>
  `
})
export class TicketsFiltersComponent {
  @Input() filtro = '';
  @Output() filtroChange = new EventEmitter<string>();
}
