import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
  
  <!-- Checkbox Selecionar Todos -->
  <label class="flex items-center gap-2 cursor-pointer select-none">
    <input type="checkbox"
           class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring focus:ring-blue-200"
           [(ngModel)]="selecionarTodos"
           (ngModelChange)="selecionarTodosChange.emit($event)" />
    <span class="text-sm font-medium text-gray-700">Selecionar todos</span>
  </label>

  <!-- Ordenação -->
  <div class="flex items-center gap-2">
    <span class="text-sm text-gray-500">Ordenar por:</span>
    
    <select [(ngModel)]="ordenarPor"
            (ngModelChange)="ordenarPorChange.emit($event)"
            class="block w-44 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
      <option value="data">Data de Criação</option>
      <option value="prioridade">Prioridade</option>
      <option value="status">Status</option>
    </select>

    <select [(ngModel)]="ordem"
            (ngModelChange)="ordemChange.emit($event)"
            class="block w-32 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200">
      <option value="asc">Crescente</option>
      <option value="desc">Decrescente</option>
    </select>
  </div>
</div>
  `
})
export class TicketsOrderComponent {
  @Input() selecionarTodos = false;
  @Output() selecionarTodosChange = new EventEmitter<boolean>();

  @Input() ordenarPor: string = 'data';
  @Output() ordenarPorChange = new EventEmitter<string>();

  @Input() ordem: string = 'desc';
  @Output() ordemChange = new EventEmitter<string>();
}
