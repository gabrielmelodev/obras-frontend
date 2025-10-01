import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardIndicadorComponent } from './card-indicador.component';

interface DashboardData {
  totalOcorrencias: number;
  totalUsuarios: number;
  resolucaoMedia: number;
  usuariosAtivos: number;
  totalTickets: number;
  totalMensagens: number;
  mediaMensagensTicket: number;
  ocorrenciasPorStatus: Record<string, number>;
  ocorrenciasPorCategoria: Record<string, number>;
  usuariosPorTipo: Record<string, number>;
  top5UsuariosAtivos: { nome: string; ocorrencias: number }[];
  ocorrenciasPorBairro: Record<string, number>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardIndicadorComponent],
  template: `
  <div class="p-6 bg-gray-50 min-h-screen space-y-8">

    <h1 class="text-3xl font-bold text-gray-800">Estatísticas</h1>

    <!-- Indicadores principais -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <app-card-indicador titulo="Total de Ocorrências" [valor]="data.totalOcorrencias" cor="bg-red-500/70 backdrop-blur-md"></app-card-indicador>
      <app-card-indicador titulo="Total de Usuários" [valor]="data.totalUsuarios" cor="bg-blue-500/70 backdrop-blur-md"></app-card-indicador>
      <app-card-indicador titulo="Resolução Média" [valor]="data.resolucaoMedia + ' dias'" cor="bg-green-500/70 backdrop-blur-md"></app-card-indicador>
      <app-card-indicador titulo="Usuários Ativos" [valor]="data.usuariosAtivos" cor="bg-yellow-500/70 backdrop-blur-md"></app-card-indicador>
      <app-card-indicador titulo="Total de Tickets" [valor]="data.totalTickets" cor="bg-purple-500/70 backdrop-blur-md"></app-card-indicador>
      <app-card-indicador titulo="Total de Mensagens" [valor]="data.totalMensagens" cor="bg-indigo-500/70 backdrop-blur-md"></app-card-indicador>
      <app-card-indicador titulo="Média Mensagens/Ticket" [valor]="data.mediaMensagensTicket" cor="bg-pink-500/70 backdrop-blur-md"></app-card-indicador>
    </div>

    <!-- Bar charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Occurrences by Status -->
      <div class="bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
        <h2 class="text-xl font-semibold mb-4">Ocorrências por Status</h2>
        <div class="space-y-2">
          <ng-container *ngFor="let s of statusKeys">
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ s }}</span>
              <span class="font-bold text-gray-800">{{ data.ocorrenciasPorStatus[s] }}</span>
            </div>
            <div class="h-3 w-full bg-gray-200 rounded overflow-hidden">
              <div [style.width.%]="(data.ocorrenciasPorStatus[s] / totalOcorrencias * 100)"
                   [ngClass]="{
                     'bg-red-500': s === 'ABERTO',
                     'bg-yellow-400': s === 'EM_ANDAMENTO',
                     'bg-green-500': s === 'FECHADO'
                   }"
                   class="h-3 rounded-full transition-all"></div>
            </div>
          </ng-container>
        </div>
      </div>

      <!-- Occurrences by Category -->
      <div class="bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
        <h2 class="text-xl font-semibold mb-4">Ocorrências por Categoria</h2>
        <div class="space-y-2">
          <ng-container *ngFor="let c of categoriaKeys">
            <div class="flex items-center justify-between">
              <span class="font-medium">{{ c }}</span>
              <span class="font-bold text-gray-800">{{ data.ocorrenciasPorCategoria[c] }}</span>
            </div>
            <div class="h-3 w-full bg-gray-200 rounded overflow-hidden">
              <div [style.width.%]="(data.ocorrenciasPorCategoria[c] / totalOcorrencias * 100)"
                   [ngClass]="{
                     'bg-blue-500': c==='Infraestrutura',
                     'bg-green-500': c==='Clima',
                     'bg-red-500': c==='Segurança'
                   }"
                   class="h-3 rounded-full transition-all"></div>
            </div>
          </ng-container>
        </div>
      </div>

    </div>

    <!-- Top 5 Active Users -->
    <div class="bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
      <h2 class="text-xl font-semibold mb-4">Top 5 Usuários Ativos</h2>
      <ol class="list-decimal pl-5 space-y-2">
        <li *ngFor="let u of data.top5UsuariosAtivos" class="flex justify-between items-center">
          <span>{{ u.nome }}</span>
          <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">{{ u.ocorrencias }}</span>
        </li>
      </ol>
    </div>

    <!-- Export Button -->
    <div class="flex justify-end">
      <button class="px-6 py-2 bg-blue-600/70 backdrop-blur-md text-white font-semibold rounded-2xl shadow hover:bg-blue-700/70 transition">
        Exportar PDF
      </button>
    </div>

  </div>
  `,
  styles: []
})
export class DashboardComponent {
  data: DashboardData = {
    totalOcorrencias: 120,
    totalUsuarios: 35,
    resolucaoMedia: 3.4,
    usuariosAtivos: 28,
    totalTickets: 50,
    totalMensagens: 220,
    mediaMensagensTicket: 4.4,
    ocorrenciasPorStatus: { ABERTO: 40, EM_ANDAMENTO: 50, FECHADO: 30 },
    ocorrenciasPorCategoria: { Infraestrutura: 30, Clima: 40, Segurança: 50 },
    usuariosPorTipo: { USER: 25, ADMIN: 10 },
    top5UsuariosAtivos: [
      { nome: 'Maria', ocorrencias: 15 },
      { nome: 'João', ocorrencias: 12 },
      { nome: 'Ana', ocorrencias: 10 },
      { nome: 'Pedro', ocorrencias: 9 },
      { nome: 'Luiza', ocorrencias: 8 }
    ],
    ocorrenciasPorBairro: { Centro: 20, BairroA: 15, BairroB: 25, BairroC: 10 }
  };

  statusKeys = Object.keys(this.data.ocorrenciasPorStatus);
  categoriaKeys = Object.keys(this.data.ocorrenciasPorCategoria);

  get totalOcorrencias() {
    return this.data.totalOcorrencias;
  }
}
