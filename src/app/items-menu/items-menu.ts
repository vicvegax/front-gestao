import { Component, inject, input, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { LoginService } from '@app/_services';
import { UsuarioNivel } from '@app/_helpers/usuario-nivel.enum';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [MatExpansionModule, MatListModule, RouterLink, RouterLinkActive, MatIcon],
  template: `
    @if(!item().adminOnly || isAdmin()) {
      @if (item().children && item().children.length > 0) {
        <mat-expansion-panel [expanded]="item().expanded"
          [class.mat-elevation-z0]="true" 
          class="!bg-transparent !shadow-none border-none">
          
          <mat-expansion-panel-header 
            class="hover:!bg-white/10 !h-10 !px-4 !rounded-xl transition-colors group">
            <mat-panel-title class="!m-0 flex items-center gap-3">
              <!-- Fonte aumentada para text-base (16px) -->
              @if (item().icon) {
                <mat-icon class="!text-white/70 group-hover:text-white">{{ item().icon }}</mat-icon>
              }
              <span class="text-base font-medium text-white/90 group-hover:text-white">
                {{ item().label }}
              </span>
            </mat-panel-title>
          </mat-expansion-panel-header>

          <!-- Linha de indentação branca com transparência -->
          <div class="ml-3 pl-3 border-l border-transparent flex flex-col gap-1 mt-1 mb-2">
            @for (child of item().children; track child.label) {
              <app-nav-item [item]="child" [isAdmin]="isAdmin()" />
            }
          </div>
        </mat-expansion-panel>
      } @else {
        <a mat-list-item 
          [routerLink]="item().route" 
          [routerLinkActiveOptions]="{ 
            exact: true,
            matrixParams: 'ignored',
            queryParams: 'ignored',
            fragment: 'ignored'
          }"
          routerLinkActive="!bg-white/20 !text-white !font-bold"
          class="!text-base !text-white/80 hover:!bg-white/10 !rounded-xl !h-10 !px-4 !flex !items-center transition-all border-none">
          <div class="flex items-center gap-3">
            @if (item().icon) {
              <mat-icon class="!text-white/70 group-[.active]:!text-white">{{ item().icon }}</mat-icon>
            }
            <span class="truncate">{{ item().label }}</span>
          </div>
        </a>
      }
    }
  `,
  styles: [`
    ::ng-deep .mat-expansion-panel-body { padding: 0 !important; }
    ::ng-deep .mat-expansion-panel-spacing { margin: 0 !important; }
    /* Ajusta a cor do ícone da setinha para branco */
    ::ng-deep .mat-expansion-indicator::after { color: rgba(255, 255, 255, 0.7) !important; }
    :host { display: block; }
  `]
})
export class NavItemComponent {
  item = input<any>();
  isAdmin = input<boolean>(false);
}

@Component({
  selector: 'app-items-menu',
  standalone: true,
  imports: [NavItemComponent],
  template: `
    @for (node of menuItems; track node.label) {
      <app-nav-item [item]="node" [isAdmin]="usuarioAdmin"/>
    }
  `
})
export class ItemsMenu {
  loginService = inject(LoginService);
  usuarioAdmin = this.loginService.usuarioValue ? this.loginService.usuarioValue.nivel >= UsuarioNivel.DIRETOR : false;

  menuItems = [
    { label: 'Home', route: '', icon: 'home' },
    { label: 'Movimento', route: '/movimento', icon: 'table_chart'},
    {
      label: 'Cadastro',
      // expanded: false,
      children: [
        { label: 'Contratos', routes: '/contratos', icon: 'description' },
        { label: 'Empresas', route: '/cargos', icon: 'business' },
        { label: 'Contas', route: '/orgaos', icon: 'account_balance' },
        { label: 'Unidades', route: '/orgaos', icon: 'location_on' },
        { label: 'Agentes', route: '/orgaos', icon: 'person_search' },
        { label: 'Fornecedores', route: '/orgaos', icon: 'handshake' },
        { label: 'Usuários', route: '/usuarios', icon: 'manage_accounts', adminOnly: this.usuarioAdmin },
      ],
    },
    {
      label: 'Bens e Materiais',
      children: [
        { label: 'Cadastro', routes: '/contratos', icon: 'file_present' },
        { label: 'Categorias', routes: '/contratos', icon: 'work' },
      ]
    },
    {
      label: 'Tabelas',
      children: [
        { label: 'Feriados', routes: '/contratos', icon: 'event_list' },
        { label: 'Eventos', route: '/eventos', icon: 'account_balance_wallet' },
        { label: 'Tipos de Documentos', routes: '/contratos', icon: 'file_present' },
        { label: 'Tipos de Contrato', routes: '/contratos', icon: 'fact_check' },
        { label: 'Tipos de Reajuste', routes: '/contratos', icon: 'policy' },
      ]
    }
  ];

  ngOnInit() {
    // Verifica se o usuário é admin
    // Supondo que você tenha um serviço de autenticação para obter o usuário atual
    // const usuarioAtual = this.authService.getUsuarioAtual();
    // this.usuarioAdmin = usuarioAtual?.nivel === UsuarioNivel.ADMIN;
  }

  resetPagina() {

  }
}