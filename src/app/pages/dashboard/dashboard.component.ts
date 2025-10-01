import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Painel Administrativo</h1>
      <div class="bg-white shadow rounded-xl p-4">
        <p><strong>Nome:</strong> {{ user?.nome }}</p>
        <p><strong>E-mail:</strong> {{ user?.email }}</p>
        <p><strong>Setor:</strong> {{ user?.setor?.nome }}</p>
        <p><strong>Role:</strong> {{ user?.role }}</p>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  user: any;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }
}
