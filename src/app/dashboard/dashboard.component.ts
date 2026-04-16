import { Component, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MovimentoService } from '@app/_services';
import { MovimentoDashBoardDto } from '@app/_dto';

type DashboardField = keyof MovimentoDashBoardDto;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class DashboardComponent {
  private movimentoService = inject(MovimentoService);
  readonly dashboard = this.movimentoService.getDashboard();
  readonly counts: Array<{ title: string; field: DashboardField }> = [
    // { title: 'Anterior', field: 'anterior' },
    { title: 'Crédito', field: 'credito' },
    { title: 'Débito', field: 'debito' },
    { title: 'Em conta', field: 'em_conta' },
  ]
}
