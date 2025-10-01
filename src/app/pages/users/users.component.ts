import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from '../../components/UsersCards/user-card.component';
import { UsuariosHeaderComponent } from '../../components/UsersCards/users-header.component';
import { LucideAngularModule } from 'lucide-angular';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  setor: string;
  status: 'ATIVO' | 'INATIVO';
  telefone?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, UserCardComponent, UsuariosHeaderComponent, LucideAngularModule],
  templateUrl: './users.component.html',
  styles: [`
.input { @apply w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm; }
.animate-fade-in { animation: fadeIn 0.2s ease-in-out; }
@keyframes fadeIn { from { opacity:0; transform: translateY(-10px) } to { opacity:1; transform: translateY(0) } }
.status-ABERTO { @apply bg-blue-100 text-blue-800; }
.status-EM_ANDAMENTO { @apply bg-purple-100 text-purple-800; }
.status-FINALIZADO { @apply bg-green-100 text-green-800; }
.status-PENDENTE_APROVACAO { @apply bg-yellow-100 text-yellow-800; }
  `]
})
export class UsuariosComponent {
  usuarios: Usuario[] = [
    { id: 1, nome: 'Maria Silva', email: 'maria@email.com', role: 'Admin', setor: 'Infraestrutura', status: 'ATIVO', telefone: '(61) 99999-0001' },
    { id: 2, nome: 'João Souza', email: 'joao@email.com', role: 'User', setor: 'Clima', status: 'INATIVO', telefone: '(61) 98888-0002' }
  ];

  usuariosFiltrados: Usuario[] = [...this.usuarios];
  selecionados = new Set<number>();
  mostrarAcoes: boolean = false;
  modalCriar = false;
  modalEditar: Usuario | null = null;
  modalAcoes: Usuario | null = null;

  @ViewChild('menuAcoes') menuAcoes!: ElementRef;

  // Fecha menu ao clicar fora
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.mostrarAcoes && this.menuAcoes && !this.menuAcoes.nativeElement.contains(event.target)) {
      this.mostrarAcoes = false;
    }
  }

  novoUsuario: Partial<Usuario> = { nome: '', email: '', role: '', setor: '', status: 'ATIVO' };

  // ----------------- Seleção -----------------
  onCheckChange(checked: boolean, userId: number) {
    if (checked) this.selecionados.add(userId);
    else this.selecionados.delete(userId);
  }

  selecionarTodos() {
    this.usuariosFiltrados.forEach(u => this.selecionados.add(u.id));
  }

  ativarSelecionados() {
    this.usuarios.forEach(u => {
      if (this.selecionados.has(u.id)) u.status = 'ATIVO';
    });
  }

    toggleAcoes() {
    this.mostrarAcoes = !this.mostrarAcoes;
  }


  fecharAcoes() {
    this.mostrarAcoes = false;
  }

  @ViewChild('menuWrapper') menuWrapper!: ElementRef;

  @HostListener('document:click', ['$event'])
  clickFora(event: Event) {
    if (this.mostrarAcoes && !this.menuWrapper.nativeElement.contains(event.target)) {
      this.fecharAcoes();
    }
  }

  desativarSelecionados() {
    this.usuarios.forEach(u => {
      if (this.selecionados.has(u.id)) u.status = 'INATIVO';
    });
  }

  ordenar(tipo: 'asc' | 'desc') {
    this.usuariosFiltrados.sort((a, b) => tipo === 'asc' ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome));
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: KeyboardEvent) {
    // Fecha todos os modais abertos
    if (this.modalCriar) this.modalCriar = false;
    if (this.modalEditar) this.modalEditar = null;
    if (this.modalAcoes) this.modalAcoes = null;
  }

  // ----------------- Modal / CRUD -----------------
  abrirModalCriarUsuario() {
    this.modalCriar = true;
    this.novoUsuario = { nome: '', email: '', role: '', setor: '', status: 'ATIVO' };
  }

  criarUsuario() {
    if (!this.novoUsuario.nome || !this.novoUsuario.email) return;
    const novo: Usuario = { id: this.usuarios.length + 1, ...this.novoUsuario } as Usuario;
    this.usuarios.push(novo);
    this.usuariosFiltrados.push(novo);
    this.modalCriar = false;
  }

  abrirModalEditar(u: Usuario) { this.modalEditar = { ...u }; }

  salvarEdicao() {
    if (!this.modalEditar) return;
    const i = this.usuarios.findIndex(x => x.id === this.modalEditar!.id);
    if (i !== -1) this.usuarios[i] = { ...this.modalEditar } as Usuario;

    const j = this.usuariosFiltrados.findIndex(x => x.id === this.modalEditar!.id);
    if (j !== -1) this.usuariosFiltrados[j] = { ...this.modalEditar } as Usuario;

    this.modalEditar = null;
  }

  abrirModalAcoes(u: Usuario) { this.modalAcoes = u; }
  fecharModalAcoes() { this.modalAcoes = null; }

  suspenderUsuario() { if (this.modalAcoes) this.modalAcoes.status = 'INATIVO'; this.fecharModalAcoes(); }
  reativarUsuario() { if (this.modalAcoes) this.modalAcoes.status = 'ATIVO'; this.fecharModalAcoes(); }

  // ----------------- Funções auxiliares -----------------
  getIniciais(nome: string): string {
    return nome.split(' ').map(n => n[0]).join('');
  }
}
