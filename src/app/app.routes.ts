import { Routes } from '@angular/router';
import { authGuard } from '@app/_helpers';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login)
  },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'cargos',
        loadComponent: () => import('./items-menu/cargos/cargos.component').then(m => m.ListagemCargos)
      },
      {
        path: 'movimento',
        loadComponent: () => import('./items-menu/movimento/movimento.component').then(m => m.ListagemMovimento)
      },
      {
        path: 'tipo-evento',
        loadComponent: () => import('./items-menu/tipo-evento/tipo-evento.component').then(m => m.ListagemTipoEvento)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./items-menu/usuarios/usuarios.component').then(m => m.ListagemUsuarios)
      },


      {
        path: 'alterar-senha',
        loadComponent: () => import('./items-menu/alterar-senha/alterar-senha.component').then(m => m.AlterarSenhaComponent),
      },
    ]
  },
  { path: '**', redirectTo: '' }
];
