import { Component } from '@angular/core';
import { TipoEventoDataSource } from './tipo-evento-datasource';
import { TipoEventoAllDto as DataDto } from '@app/_dto';
import { FormTipoEvento } from "./form-tipo-evento/form-tipo-evento.component";
import { BaseComponent, CustomListagem } from '@app/_helpers';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-tipo-evento',
  templateUrl: './tipo-evento.component.html',
  imports: [FormTipoEvento, CustomListagem ]
})
export class ListagemTipoEvento extends BaseComponent<DataDto> {
  dataSource = new TipoEventoDataSource();
  columns = [
    {key: 'nome', label: 'Nome'},
    {key: 'obs', label: 'Obs.'},
    {key: 'ativo', label: 'Disponível?', type: 'ativo'},
    {key: 'id', label: 'Id.'}
  ]

  constructor() {
    super();
    this.dataSource.loadData();
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
          // this.formComponent.setFieldError('nome', { conflict: 'Este Cargo já existe!' });
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

}
