import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MapaInterativoComponent } from './pages/interactive-map/interactive-map.component';

import { LayoutComponent } from './pages/layout/layout.component';
import { UsuariosComponent } from './pages/users/users.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { DashboardComponent } from './pages/statistic/statistic.component';

import { OcorrenciasComponent } from './pages/occurrences/occurrencescomponent';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'interactive-map', component: MapaInterativoComponent }, // ajustado para 'mapa'
      { path: 'occurrences', component: OcorrenciasComponent },
      { path: 'users', component: UsuariosComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'statistics', component: DashboardComponent },
      { path: '', redirectTo: 'mapa', pathMatch: 'full' }
    ]
  },
  // Rota de erro genérica
  { path: 'error', component: ErrorComponent },
  // Qualquer outra rota cai aqui
  { path: '**', redirectTo: 'error' }
];
