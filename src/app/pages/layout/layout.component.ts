import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-100 flex">
      <!-- Sidebar -->
      <app-sidebar [collapsed]="isMobile"></app-sidebar>

      <!-- Conteúdo principal -->
      <main class="flex-1 p-6 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class LayoutComponent {
  isMobile = false; 

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768; 
  }
}
