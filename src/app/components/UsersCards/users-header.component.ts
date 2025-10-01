// src/app/components/usuarios-header.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <!-- Título -->
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          Gerenciamento de Usuários
        </h1>
        <p class="text-sm text-muted-foreground mt-1">
          Gerencie usuários, funções e permissões do sistema
        </p>
      </div>

      <!-- Ações -->
      <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <!-- Botão Exportar -->
        <button
          class="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-gray-300 w-full sm:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            class="lucide lucide-download h-4 w-4"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span class="hidden sm:inline">Exportar</span>
        </button>

        <!-- Botão Novo Usuário -->
        <button
          (click)="novoUsuarioClick()"
          class="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-gray-300 w-full sm:w-auto bg-white hover:bg-blue-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            class="lucide lucide-user-plus h-4 w-4"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
          <span class="hidden sm:inline">Novo Usuário</span>
        </button>
      </div>
    </div>
  `,
})
export class UsuariosHeaderComponent {
  @Output() novoUsuario = new EventEmitter<void>();

  novoUsuarioClick() {
    this.novoUsuario.emit();
  }
}
