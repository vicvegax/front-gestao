import { lastValueFrom } from 'rxjs';
import { Movimento as DadosDto } from '@app/_dto';
import { inject, Signal, signal } from '@angular/core';
import { MovimentoService as DadosService } from '@app/_services';
import { BaseDataSource } from '@app/_helpers/base-datasource';
import Decimal from 'decimal.js';


/**
 * Data source for the Cargos view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class MovimentoDataSource extends BaseDataSource<DadosDto> {
  override defaultSize = 1000;

  dataService = inject(DadosService);

  private conta!: number;
  private dataInicial!: string;
  private dataFinal!: string;
  loading = signal<boolean>(false);

  saldoAnterior = signal<Decimal | undefined>(undefined);
  saldoCredito = signal<Decimal | undefined>(undefined);
  saldoDebito = signal<Decimal | undefined>(undefined);
  saldoEmConta = signal<Decimal | undefined>(undefined);

  constructor() {
    super();
  }

  setCriteria(conta: number, dataInicial: string, dataFinal: string): void {
    this.conta = conta;
    this.dataInicial = dataInicial;
    this.dataFinal = dataFinal;
  }

  async loadData(): Promise<void> {
    try {
      this.loading.set(true);
      const dados = await lastValueFrom(this.dataService.getAll(this.conta, this.dataInicial, this.dataFinal));
      this.saldoAnterior.set(new Decimal(dados.anterior));
      this.saldoCredito.set(new Decimal(dados.credito));
      this.saldoDebito.set(new Decimal(dados.debito));
      this.saldoEmConta.set(new Decimal(dados.emConta));
      
      this.dataSignal.set(dados.data)
    } finally {
      this.loading.set(false);
      // O sinal será atualizado após a conclusão da Promise
    }
  }

  saveData(row: DadosDto) {
    return this.dataService.save(row);
  }

}