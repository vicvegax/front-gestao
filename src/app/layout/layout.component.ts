import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { UsuarioAuthDto } from '@app/_dto';
import { environment } from '@env/environment';
import { ItemsMenu } from '@app/items-menu/items-menu';
import { LoginService } from '@app/_services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule, MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet, ItemsMenu, RouterLink
]
})
export class LayoutComponent {
  loginService = inject(LoginService);
  usuario?: UsuarioAuthDto | null = null;
  modoDev = environment.modoDev;

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor() {
    this.loginService.usuario.subscribe(u => this.usuario = u);
  }
  
  onItemsMenuClick(event: MouseEvent, drawer: MatSidenav) {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const anchor = target.closest('a[href]');
    if (anchor) {
      drawer.close();
    }
  }

  logout() {
    this.loginService.logout();
  }
}
