import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div class="text-center max-w-md w-full">
        <h1 class="text-6xl font-bold text-gray-800 mb-4">{{ code }}</h1>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">{{ title }}</h2>
        <p class="text-gray-600 mb-6">{{ message }}</p>

        <div class="flex justify-center gap-4">
          <button (click)="goBack()"
                  class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
            Voltar
          </button>
          <a routerLink="/mapa"
             class="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
            Ir para Dashboard
          </a>
        </div>
      </div>
    </div>
  `
})
export class ErrorComponent implements OnInit {
  code: number = 404;
  title: string = 'Página não encontrada';
  message: string = 'A página que você está tentando acessar não existe ou ocorreu um erro.';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Permite passar o código e a mensagem via query params
    const codeParam = this.route.snapshot.queryParamMap.get('code');
    const messageParam = this.route.snapshot.queryParamMap.get('message');

    if (codeParam) {
      this.code = Number(codeParam);
      if (this.code === 500) this.title = 'Erro Interno do Servidor';
      else if (this.code === 502) this.title = 'Bad Gateway';
      else if (this.code === 403) this.title = 'Acesso Negado';
      else this.title = 'Página não encontrada';
    }

    if (messageParam) this.message = messageParam;
  }

  goBack() {
   
    this.router.navigateByUrl('/');
  }
}
