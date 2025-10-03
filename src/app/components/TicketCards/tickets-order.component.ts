import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type OrdenarPor = 'data' | 'prioridade' | 'status';
type Ordem = 'asc' | 'desc';

@Component({
  selector: 'app-tickets-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-lg p-3 shadow-sm">

  <!-- Selecionar Todos -->
  <label class="flex items-center gap-2 cursor-pointer select-none">
    <input type="checkbox"
           id="select-all"
           class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
           [(ngModel)]="selecionarTodos"
           (ngModelChange)="selecionarTodosChange.emit($event)" />
    <span class="text-sm font-medium text-gray-700">Selecionar todos</span>
  </label>

  <!-- Ordenação -->
  <fieldset class="flex items-center gap-2">
    <legend class="sr-only">Ordenação</legend>
    <span class="text-sm text-gray-500">Ordenar por:</span>

    <select id="ordenar-por"
            [(ngModel)]="ordenarPor"
            (ngModelChange)="ordenarPorChange.emit($event)"
            class="block w-44 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
      <option *ngFor="let opt of ordenarPorOpcoes; trackBy: trackByValue" [value]="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <select id="ordem"
            [(ngModel)]="ordem"
            (ngModelChange)="ordemChange.emit($event)"
            class="block w-32 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
      <option value="asc">Crescente</option>
      <option value="desc">Decrescente</option>
    </select>
  </fieldset>
</div>
  `
})
export class TicketsOrderComponent {
  @Input() selecionarTodos = false;
  @Output() selecionarTodosChange = new EventEmitter<boolean>();

  @Input() ordenarPor: OrdenarPor = 'data';
  @Output() ordenarPorChange = new EventEmitter<OrdenarPor>();

  @Input() ordem: Ordem = 'desc';
  @Output() ordemChange = new EventEmitter<Ordem>();

  ordenarPorOpcoes = [
    { value: 'data', label: 'Data de Criação' },
    { value: 'prioridade', label: 'Prioridade' },
    { value: 'status', label: 'Status' }
  ] as const;

  trackByValue = (_: number, item: { value: string }) => item.value;
}
