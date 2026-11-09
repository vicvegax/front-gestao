import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { MovimentoDataSource } from './movimento-datasource';
import { Movimento as DataDto } from '@app/_dto';
import { BaseComponent, TooltipTruncadoDirective, ValorPipe } from '@app/_helpers';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { LoadingBarComponent } from '@app/_helpers/loading-bar.component';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { Agendado, EmConta, Liquidado } from '@app/_helpers/situacao.constant';
import { DateTime } from 'luxon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ContaService } from '@app/_services';
import { toSignal } from '@angular/core/rxjs-interop';
import Decimal from 'decimal.js';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-movimento',
  templateUrl: './movimento.component.html',
  imports: [
    MatCardModule, LoadingBarComponent, MatFormFieldModule, MatIcon, MatTableModule, MatSortModule,
    MatPaginatorModule, MatButtonModule, DatePipe, MatSelectModule, MatLabel, MatInputModule,
    ValorPipe, MatDatepickerModule, MatCheckboxModule, MatTooltipModule, TooltipTruncadoDirective,
    MatAccordion, MatExpansionModule
  ]
})
export class ListagemMovimento extends BaseComponent<DataDto> {
  route = inject(ActivatedRoute);

  contaService = inject(ContaService);
  contas = toSignal(this.contaService.getAtivos(), { initialValue: []});

  dataSource = new MovimentoDataSource();
  override loading = this.dataSource.loading;

  selecionados = new SelectionModel<any>(true, []);
  selecionadosSignal = signal<any[]>([]);

  saldoAnterior = this.dataSource.saldoAnterior; // Signal de Decimal
  saldoCredito = this.dataSource.saldoCredito;
  saldoDebito = this.dataSource.saldoDebito;
  saldoEmConta = this.dataSource.saldoEmConta;

  // 2. Cálculo do Saldo Atual (Computado e Reativo)
  saldoAtual = computed(() => {
    const anterior = this.saldoAnterior();
    const credito = this.saldoCredito();
    const debito = this.saldoDebito();

    if(!anterior || !credito || !debito) return new Decimal(0);
    
    return anterior.plus(credito).plus(debito);
  });

  somaValorTotal = computed(() => this.dataSource.dataSignal().reduce((acc, row) => acc.plus(row.valor), new Decimal(0)));
  somaValorSelecionado = computed(() => this.selecionadosSignal().reduce((acc, row) => acc.plus(row.valor), new Decimal(0)));
  
  // 3. O Total Exibido
  footerValor = computed(() => {
    return this.selecionadosSignal().length > 0 ? this.somaValorSelecionado() : this.somaValorTotal();
  });

  // labelTotal = computed(() => {
  //   return this.selecionados.hasValue() ? 'Total Selecionado' : 'Total Geral';
  // });

  saldoProjetado = computed(() => {
    const saldoAtual = this.saldoAtual();
    const emConta = this.saldoEmConta();
    if(!saldoAtual || !emConta) return new Decimal(0);
    const emContaSelecionado = this.somaEmContaSelecionado();

    return saldoAtual.plus(this.selecionadosSignal().length > 0 ? emContaSelecionado : emConta);
  })

  somaEmContaSelecionado = computed(() => {
    return this.selecionadosSignal().reduce((acc, row) => {
      // Soma apenas se a situação for 'C'
      if (row.situacaoMovimento === EmConta) {
        const valor = row.valor ? new Decimal(row.valor) : new Decimal(0);
        return acc.plus(valor);
      }
      return acc;
    }, new Decimal(0));
  });

  toggleLinha(row: any) {
    this.selecionados.toggle(row);
    this.selecionadosSignal.set([...this.selecionados.selected]);
  }

  /** Verifica se o número de linhas selecionadas é igual ao total de linhas. */
  isAllSelected() {
    const numSelected = this.selecionados.selected.length;
    const numRows = this.dataSource.dataSignal().length;
    return numSelected === numRows;
  }

  //Inverte a seleção de todas as linhas
  masterToggle() {
    this.isAllSelected() ?
        this.selecionados.clear() :
        this.selecionados.select(...this.dataSource.dataSignal());

    this.selecionadosSignal.set([...this.selecionados.selected]);
  }

  title = signal('Movimento');
  novo = output<void>();
  editar = output<DataDto>();

  idConta = signal<number | undefined>(undefined);
  dataInicial = signal<DateTime>(DateTime.now());
  dataFinal = signal<DateTime>(DateTime.now());


  get displayedColumns() {
    return ['index', 'situacaoMovimento', 'unidade', 'pessoal', 'evento', 'dataVencimento', 'dataBaixa', 'competencia', 'valor', 'tipoDocumento', 'dataEntregou', 'id', 'acoes'];
  }
  
  handleSortEvent(e: Sort) {
    this.dataSource.updateParams({ sort: e.active, dir: e.direction })
  }

  handlePageEvent(e: PageEvent) {
    this.dataSource.updateParams({ page: e.pageIndex, size: e.pageSize })
  }

  constructor() {
    super();

    effect(() => {
      const lista = this.contas();

      if(lista.length > 0 && this.idConta() === undefined) {
        this.idConta.set(lista[0].id);
      }
    })

    effect(() => {
      const conta = this.idConta();
      const dataInicial = this.dataInicial();
      const dataFinal = this.dataFinal();
      if(conta !== undefined && dataInicial.isValid && dataFinal.isValid && dataFinal >= dataInicial) {
        this.dataSource.setCriteria(conta, dataInicial.toISODate()!, dataFinal.toISODate()!);
        this.dataSource.loadData();
        // this.loading.set(false);
      }
    })

  }

  async onSalvar(row: DataDto) {
    try {
      this.loading.set(true);
      const salvo = await lastValueFrom(this.dataSource.saveData(row));
      this.hideForm(true);
      this.showSuccessToast('Registro salvo com sucesso!');
    } catch (err) {

      let mensagemErro = "Ocorreu um Erro inesperado ao salvar o registro.";
      if (err instanceof HttpErrorResponse) {
        if(err.status === HttpStatusCode.Conflict) {
          this.showErrorToast('Erro ao salvar. Já existe um registro como este.');
          return;
        }
        const errorMessage = err.error?.message;
        console.error("Erro na API", errorMessage || err.error);
        
        if(errorMessage) {
          mensagemErro = Array.isArray(errorMessage)
            ? errorMessage.join(', ')
            : errorMessage;
        }
      } else {
        console.error(err);
      }
      this.showErrorToast(mensagemErro); 
    } finally {
      this.loading.set(false);
    }
  }

  getSituacaoClasses(situacao: string) {
    return {
      [Liquidado]: 'cell-situacao-liquidado',
      [Agendado]: 'cell-situacao-agendado',
      [EmConta]: 'cell-situacao-em-conta'
    }[situacao] || '';
  }

  getDataVencimentoClass(row: DataDto ) {
    if(row.ultimaParcela) {
      return 'cell-ultima-parcela'
    }

    return '';
  }

  getDataBaixaClass(row: DataDto) {
    if(row.situacaoMovimento != Liquidado && row.dataVencimento.startOf('day') < DateTime.now().startOf('day') ) {
      return 'cell-data-vencido'
    }

    return '';
  }

  getRowClass(row: DataDto) {
    if(this.selecionados.isSelected(row)) return 'row-selecionado';
    if(row.dataEntregou && row.situacaoMovimento !== Liquidado) return 'row-entregue';
    return '';
  }
}
