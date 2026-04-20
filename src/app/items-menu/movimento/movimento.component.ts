import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { MovimentoDataSource } from './movimento-datasource';
import { Movimento as DataDto, Movimento } from '@app/_dto';
import { BaseComponent } from '@app/_helpers';
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
import { ValorPipe } from "../../_helpers/valor-pipe";
import { DatePipe } from '@angular/common';
import { Agendado, EmConta, Liquidado } from '@app/_helpers/situacao.constant';
import { DateTime } from 'luxon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { ContaService } from '@app/_services';
import { toSignal } from '@angular/core/rxjs-interop';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-movimento',
  templateUrl: './movimento.component.html',
  imports: [
    MatCardModule, LoadingBarComponent, MatFormFieldModule, MatIcon, MatTableModule, MatSortModule,
    MatPaginatorModule, MatButtonModule, DatePipe, MatSelectModule, MatLabel, MatInputModule,
    ValorPipe, MatDatepickerModule, MatDateRangeInput, MatDateRangePicker, 
]
})
export class ListagemMovimento extends BaseComponent<DataDto> {
  route = inject(ActivatedRoute);

  contaService = inject(ContaService);
  contas = toSignal(this.contaService.getAtivos(), { initialValue: []});

  dataSource = new MovimentoDataSource();
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
    
    return anterior
      .plus(credito)
      .minus(debito);
  });

  saldoProjetado = computed(() => {
    const anterior = this.saldoAnterior();
    const emConta = this.saldoEmConta();
    if(!anterior || !emConta) return new Decimal(0);

    return anterior.plus(emConta);
  })

  title = signal('Movimento');
  novo = output<void>();
  editar = output<DataDto>();

  idConta = signal<number | undefined>(undefined);
  dataInicial = signal<DateTime>(DateTime.now());
  dataFinal = signal<DateTime>(DateTime.now());

  get displayedColumns() {
    return ['index', 'situacaoMovimento', 'unidade', 'pessoal', 'evento', 'dataVencimento', 'dataBaixa', 'competencia', 'valor', 'dataEntregou', 'id', 'acoes'];
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
      if(conta !== undefined && dataInicial.isValid && dataFinal.isValid) {
        this.dataSource.setCriteria(conta, dataInicial.toISODate()!, dataFinal.toISODate()!);
        this.dataSource.loadData();
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
          // this.formComponent.setFieldError('nome', { conflict: 'Este Serviço já existe!' });
          this.showErrorToast('Erro ao salvar. Já existe um registro com este nome.');
          return;
        }
        const errorMessage = err.error?.message;
        console.error("Erro a API", errorMessage || err.error);
        
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
      [Liquidado]: 'bg-yellow-200! text-yellow-800!',
      [Agendado]: 'bg-orange-300! text-orange-800!',
      [EmConta]: 'bg-cyan-400! text-cyan-800!'
    }[situacao] || '';
  }

  getDataVencimentoClass(row: Movimento) {
    if(row.ultimaParcela) {
      return 'bg-orange-300!'
    }

    return '';
  }

  getDataBaixaClass(row: Movimento) {
    if(row.situacaoMovimento != Liquidado && row.dataVencimento.startOf('day') < DateTime.now().startOf('day') ) {
      return 'bg-red-300!'
    }

    return '';
  }
}
