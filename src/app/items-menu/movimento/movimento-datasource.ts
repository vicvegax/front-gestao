import { lastValueFrom } from 'rxjs';
import { MovimentoDto as DadosDto } from '@app/_dto';
import { inject } from '@angular/core';
import { MovimentoService as DadosService } from '@app/_services';
import { BaseDataSource } from '@app/_helpers/base-datasource';


/**
 * Data source for the Cargos view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class MovimentoDataSource extends BaseDataSource<DadosDto> {
  dataService = inject(DadosService);

  constructor() {
    super();
  }

  async loadData(): Promise<void> {
    try {
      const dados = await lastValueFrom(this.dataService.getAll());
      this.dataSignal.set(dados.data)
    } finally {
      // O sinal será atualizado após a conclusão da Promise
    }
  }

  saveData(row: DadosDto) {
    return this.dataService.save(row);
  }

}