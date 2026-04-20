import { Component, input, output, viewChild, contentChild, TemplateRef, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CpfPipe } from "../cpf.pipe";
import { LoadingBarComponent } from "../loading-bar.component";
import { ActivatedRoute } from '@angular/router';
import { BaseDataSource } from '@app/_helpers/base-datasource';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'custom-listagem',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, NgxMaskPipe,
    CpfPipe,
    LoadingBarComponent
],
  templateUrl: './custom-listagem.html'
})
export class CustomListagem<T> {
  route = inject(ActivatedRoute);

  // Inputs usando a nova sintaxe Signal do Angular
  columns = input.required<{key: string, value?: (row: T) => string, label: string, type?: string}[]>();
  dataSource = input.required<BaseDataSource<T>>();
  id = input<number | undefined>(undefined);
  loading = input<boolean>(false);
  showForm = input<boolean>(false);
  title = input<string>('Listagem');
  enumMap = input<Record<string, Record<number | string, string>> | undefined>(undefined);

  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  // Outputs
  novo = output<void>();
  editar = output<T>();
  filtrar = output<string>();

  handlePageEvent(e: PageEvent) {
    this.dataSource().updateParams({ page: e.pageIndex, size: e.pageSize })
  }

  handleSortEvent(e: Sort) {
    this.dataSource().updateParams({ sort: e.active, dir: e.direction })
  }


  // Template customizado para o formulário (passado pelo pai)
  formTemplate = contentChild<TemplateRef<any>>('form');

  get displayedColumns() {
    return [...this.columns().map(c => c.key), 'acoes'];
  }

  aplicaFiltro(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.filtrar.emit(val);
  }

  limparFiltro() {
    this.filtrar.emit('');
  }

}
