import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ocorrencia {
  id: number;
  descricao: string;
  solicitante: string;
  categoria: string;
  data: string;
  status: 'PENDENTE_APROVACAO' | 'ABERTO' | 'EM_ANDAMENTO' | 'FINALIZADO';
  selecionado?: boolean;
}

interface Usuario {
  id: number;
  nome: string;
  role: 'USER' | 'ADMIN' | 'ADMIN_MASTER';
  setor?: string; // setor do administrador
}

@Component({
  selector: 'app-occurrences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './occurrences.component.html',
})
export class OcorrenciasComponent {

  // Logged-in user simulation
  //usuarioLogado: User = { id: 1, name: 'IT Sector Admin', role: 'ADMIN', sector: 'Security' };
  // To test ADMIN_MASTER:
  usuarioLogado: Usuario = { id: 2, nome: 'Super Admin', role: 'ADMIN_MASTER' };

  filters = { busca: '', status: '', categoria: '', dataInicial: '', dataFinal: '' };
  pageSize = 3;
  page = 1;
  loading = true;

  ocorrencias: Ocorrencia[] = [
    { id: 1, descricao: 'Queda de energia', solicitante: 'Maria', categoria: 'Infraestrutura', data: '2025-09-15', status: 'ABERTO' },
    { id: 2, descricao: 'Alagamento na rua X', solicitante: 'João', categoria: 'Clima', data: '2025-09-14', status: 'EM_ANDAMENTO' },
    { id: 3, descricao: 'Incêndio em galpão', solicitante: 'Ana', categoria: 'Segurança', data: '2025-09-13', status: 'FINALIZADO' },
    { id: 4, descricao: 'Vazamento de gás', solicitante: 'Carlos', categoria: 'Segurança', data: '2025-09-12', status: 'PENDENTE_APROVACAO' },
    { id: 5, descricao: 'Tempestade forte', solicitante: 'Beatriz', categoria: 'Clima', data: '2025-09-11', status: 'ABERTO' },
    { id: 6, descricao: 'Risco de desabamento', solicitante: 'Pedro', categoria: 'Infraestrutura', data: '2025-09-10', status: 'EM_ANDAMENTO' },
    { id: 7, descricao: 'Furto em obra', solicitante: 'Lucas', categoria: 'Segurança', data: '2025-09-09', status: 'FINALIZADO' },
    { id: 8, descricao: 'Inundações previstas', solicitante: 'Mariana', categoria: 'Clima', data: '2025-09-08', status: 'PENDENTE_APROVACAO' },
    { id: 9, descricao: 'Problema estrutural em ponte', solicitante: 'Rafael', categoria: 'Infraestrutura', data: '2025-09-07', status: 'ABERTO' },
    { id: 10, descricao: 'Deslizamento de terra', solicitante: 'Fernanda', categoria: 'Clima', data: '2025-09-06', status: 'EM_ANDAMENTO' },
    { id: 11, descricao: 'Ameaça de bomba', solicitante: 'Gabriel', categoria: 'Segurança', data: '2025-09-05', status: 'FINALIZADO' },
    { id: 12, descricao: 'Queda de árvore', solicitante: 'Aline', categoria: 'Clima', data: '2025-09-04', status: 'PENDENTE_APROVACAO' },
    { id: 13, descricao: 'Problema em rede elétrica', solicitante: 'Diego', categoria: 'Infraestrutura', data: '2025-09-03', status: 'ABERTO' },
    { id: 14, descricao: 'Vento forte derrubando estruturas', solicitante: 'Patrícia', categoria: 'Clima', data: '2025-09-02', status: 'EM_ANDAMENTO' },
    { id: 15, descricao: 'Roubo de equipamentos', solicitante: 'Bruno', categoria: 'Segurança', data: '2025-09-01', status: 'FINALIZADO' },
    { id: 16, descricao: 'Infiltração em prédio público', solicitante: 'Camila', categoria: 'Infraestrutura', data: '2025-08-31', status: 'PENDENTE_APROVACAO' },
    { id: 17, descricao: 'Cheias em área residencial', solicitante: 'Eduardo', categoria: 'Clima', data: '2025-08-30', status: 'ABERTO' },
    { id: 18, descricao: 'Ameaça de desabamento', solicitante: 'Juliana', categoria: 'Infraestrutura', data: '2025-08-29', status: 'EM_ANDAMENTO' },
    { id: 19, descricao: 'Furto em depósito', solicitante: 'Marcelo', categoria: 'Segurança', data: '2025-08-28', status: 'FINALIZADO' },
    { id: 20, descricao: 'Tempestade com granizo', solicitante: 'Sabrina', categoria: 'Clima', data: '2025-08-27', status: 'PENDENTE_APROVACAO' },
  ];

  // Lista filtrada considerando o setor do admin
  ocorrenciasFiltradas: Ocorrencia[] = [];
  ocorrenciasExibidas: Ocorrencia[] = [];

  statusLabels = {
    PENDENTE_APROVACAO: 'Pendente',
    ABERTO: 'Aberto',
    EM_ANDAMENTO: 'Em Andamento',
    FINALIZADO: 'Finalizado'
  };

  statusClasses = {
    PENDENTE_APROVACAO: 'bg-yellow-100 text-yellow-800',
    ABERTO: 'bg-blue-100 text-blue-800',
    EM_ANDAMENTO: 'bg-orange-100 text-orange-800',
    FINALIZADO: 'bg-green-100 text-green-800'
  };

  constructor() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.page = 1;

    // Filtra por setor se usuário for ADMIN (não master)
    const filtroPorSetor = (o: Ocorrencia) => {
      if (this.usuarioLogado.role === 'ADMIN_MASTER') return true;
      return o.categoria === this.usuarioLogado.setor; // só categorias do setor
    };

    this.ocorrenciasFiltradas = this.ocorrencias.filter(o =>
      filtroPorSetor(o) &&
      (!this.filters.busca || o.descricao.toLowerCase().includes(this.filters.busca.toLowerCase()) || o.solicitante.toLowerCase().includes(this.filters.busca.toLowerCase())) &&
      (!this.filters.status || o.status === this.filters.status) &&
      (!this.filters.categoria || o.categoria.toLowerCase().includes(this.filters.categoria.toLowerCase())) &&
      (!this.filters.dataInicial || new Date(o.data) >= new Date(this.filters.dataInicial)) &&
      (!this.filters.dataFinal || new Date(o.data) <= new Date(this.filters.dataFinal))
    );

    this.atualizarExibidas();
  }

  atualizarExibidas() {
    this.ocorrenciasExibidas = this.ocorrenciasFiltradas.slice(0, this.page * this.pageSize);
  }

  carregarMais() {
    this.loading = true;
    setTimeout(() => {
      this.page++;
      this.atualizarExibidas();
      this.loading = false;
    }, 1000); // ajustado para teste rápido
  }

  alterarStatusEmMassa(status: Ocorrencia['status']) {
    this.ocorrencias.forEach(o => {
      if (o.selecionado) o.status = status;
    });
    this.aplicarFiltros();
  }
}
