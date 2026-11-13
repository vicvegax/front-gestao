import { Component, computed, input, output, signal } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { ContaAtivoDto } from '@app/_dto';
import Decimal from 'decimal.js';
import { ValorPipe } from '@app/_helpers';
import { DateTime } from 'luxon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MovimentoDataSource } from '../movimento-datasource';

export interface FiltroMovimentoParams {
  conta: number | undefined; // ou string/number, dependendo do que o seu select guarda
  dataInicio: DateTime | undefined;
  dataFim: DateTime | undefined;
}

@Component({
  selector: 'app-filtro-movimento',
  imports: [
    MatFormFieldModule, MatIcon, MatButtonModule, MatSelectModule, MatLabel, MatInputModule,
    ValorPipe, MatDatepickerModule,  
  ],
  templateUrl: './filtro-movimento.html',
  styleUrl: './filtro-movimento.scss',
})
export class FiltroMovimento {
  dataSource = input.required<MovimentoDataSource>();
  idConta = input<number>();
  saldoAnterior = computed(() => this.dataSource().saldoAnterior());
  saldoCredito = computed(() => this.dataSource().saldoCredito());
  saldoDebito = computed(() => this.dataSource().saldoDebito());
  saldoAtual = computed(() => this.saldoAnterior().plus(this.saldoCredito()).plus(this.saldoDebito()));
  saldoEmConta = computed(() => this.dataSource().saldoEmConta());
  somaEmContaSelecionado = input<Decimal>();

  saldoProjetado = computed(() => {
    const saldoAtual = this.saldoAtual();
    const emConta = this.saldoEmConta();
    // if(!saldoAtual || !emConta) return new Decimal(0);
    const emContaSelecionado = this.somaEmContaSelecionado();

    return saldoAtual.plus(emContaSelecionado ?? emConta);
  })

  filtro = output<FiltroMovimentoParams>();
  listaContas = input.required<ContaAtivoDto[]>();
  modoPrivacidade = input.required<boolean>();
  loading = input.required<boolean>();
  mostrarSaldos = signal<boolean>(false); // Começa fechado, economizando espaço
  dataInicial = input.required<DateTime>();
  dataFinal = input.required<DateTime>();
  novo = output<void>();

  aplicarFiltro(conta: number | undefined, dataInicio: DateTime | undefined, dataFim: DateTime | undefined) {
    this.filtro.emit({
      conta, 
      dataInicio, 
      dataFim
    });
  }
}
