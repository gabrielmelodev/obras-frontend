import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
    setor: { id: string; nome: string };
    role: string;
  };
  expiresAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: AuthResponse['user'] | null = null;

  // Usuários mock para teste
  private users = [
    {
      id: '1',
      email: 'admin@teste.com',
      nome: 'Administrador',
      setor: { id: '1', nome: 'TI' },
      role: 'ADMIN_MASTER',
      password: '123456',
    },
    {
      id: '2',
      email: 'user@teste.com',
      nome: 'Usuário Comum',
      setor: { id: '2', nome: 'Operações' },
      role: 'USER',
      password: '123456',
    },
  ];

  constructor() {}

  login(email: string, password: string): Observable<AuthResponse> {
    const user = this.users.find(u => u.email === email && u.password === password);

    if (user) {
      const response: AuthResponse = {
        token: 'fake-jwt-token',
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          setor: user.setor,
          role: user.role,
        },
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hora de validade
      };

      // Salvar usuário logado
      this.currentUser = response.user;

      return of(response).pipe(delay(1000)); // simula delay de rede
    } else {
      return throwError(() => new Error('E-mail ou senha inválidos')).pipe(delay(1000));
    }
  }

  getUser(): AuthResponse['user'] | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }
}
