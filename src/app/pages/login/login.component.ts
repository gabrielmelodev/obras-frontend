import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  anoAtual: number = new Date().getFullYear();
  versao: string = "1.0.0"; 

  private toastTimeout: any;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.showToast('Preencha todos os campos corretamente');
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (res: AuthResponse) => this.handleSuccess(res),
      error: (err) => this.handleError(err),
    });
  }

  private handleSuccess(res: AuthResponse) {
    this.loading = false;

    if (res.user.role === 'ADMIN_MASTER') {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      this.router.navigate(['/interactive-map']);
    } else {
      this.showToast('Acesso negado. Usuário não é administrador.');
    }
  }

  private handleError(err: any) {
    this.loading = false;

    if (err?.status === 401) {
      this.showToast('E-mail ou senha inválidos');
    } else {
      this.showToast('Ocorreu um erro. Tente novamente mais tarde.');
    }
  }

  scrollIntoView(event: FocusEvent) {
    const target = event.target as HTMLElement;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  
  private showToast(message: string, duration: number = 4000) {
    
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      const existing = document.getElementById('login-toast');
      if (existing) existing.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'login-toast';
    toast.textContent = message;
    toast.className = `
      fixed top-8 right-4 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium
      bg-red-500 text-white backdrop-blur-md bg-opacity-90
      animate__animated animate__fadeInDown z-50
    `;
    document.body.appendChild(toast);

    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('animate__fadeInDown');
      toast.classList.add('animate__fadeOutUp');
      toast.addEventListener('animationend', () => toast.remove());
    }, duration);
  }
}
