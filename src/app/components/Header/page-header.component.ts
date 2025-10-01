import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  imports:[LucideAngularModule,  CommonModule  ]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  
  @Output() exportar = new EventEmitter<void>();
  @Output() novo = new EventEmitter<void>();
}
