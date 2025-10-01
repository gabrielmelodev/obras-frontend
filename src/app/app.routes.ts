import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

import { MapaInterativoComponent } from './pages/interactive-map/interactive-map.component';
import { OcorrenciasComponent } from './pages/occurrences/occurrencescomponent';
import { LayoutComponent } from './pages/layout/layout.component';
import { UsuariosComponent } from './pages/users/users.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { DashboardComponent } from './pages/statistic/statistic.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'interactive-map', component: MapaInterativoComponent },
      { path: 'occurrences', component: OcorrenciasComponent },
      { path: 'users', component: UsuariosComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'statistics', component: DashboardComponent },
      { path: '', redirectTo: 'mapa', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
