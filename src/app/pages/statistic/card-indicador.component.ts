import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-indicador',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow p-4 flex flex-col items-start justify-center">
      <h3 class="text-sm font-semibold text-gray-500">{{ titulo }}</h3>
      <p class="text-2xl font-bold">{{ valor }}</p>
    </div>
  `
})
export class CardIndicadorComponent {
  @Input() titulo!: string;
  @Input() valor!: string | number;
}
