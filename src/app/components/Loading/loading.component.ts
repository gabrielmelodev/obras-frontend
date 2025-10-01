// src/app/components/loading/loading.component.ts
import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-loading',
  template: `
    <div *ngIf="loadingService.loading$ | async" class="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  `
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
