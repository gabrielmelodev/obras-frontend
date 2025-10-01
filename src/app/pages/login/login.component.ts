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
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.showError('Preencha todos os campos corretamente');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

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
      this.router.navigate(['/dashboard']);
    } else {
      this.showError('Acesso negado. Usuário não é administrador.');
    }
  }

  private handleError(err: any) {
    this.loading = false;

    
    if (err?.status === 401) {
      this.showError('E-mail ou senha inválidos');
    } else {
      this.showError('Ocorreu um erro. Tente novamente mais tarde.');
    }
  }

  
  scrollIntoView(event: FocusEvent) {
    const target = event.target as HTMLElement;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

 
  private showError(message: string, duration: number = 5000) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, duration);
  }
}
