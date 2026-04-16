import { Component } from '@angular/core';
import { UsuariosDataSource } from './usuarios-datasource';
import { UsuarioAllDto as DataDto } from '@app/_dto';
import { FormUsuario } from "./form-usuario/form-usuario.component";
import { BaseComponent, UsuarioNivel } from '@app/_helpers';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { CustomListagem } from "@app/_helpers/custom-listagem/custom-listagem";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  imports: [ CustomListagem, FormUsuario ]
})
export class ListagemUsuarios extends BaseComponent<DataDto> {
  dataSource = new UsuariosDataSource();
  columns = [
    {key: 'cpf', label: 'CPF', type: 'cpf'},
    {key: 'nome', label: 'Nome'},
    {key: 'nivel', label: 'Nível', type: 'enum'},
    {key: 'ativo', label: 'Ativo?', type: 'ativo'},
    {key: 'id', label: 'Id.'}
  ]

  nivelMap = {
    nivel: {
      // [UsuarioNivel.DESENVOLVEDOR]: UsuarioNivel[UsuarioNivel.DESENVOLVEDOR],
      [UsuarioNivel.DIRETOR]: UsuarioNivel[UsuarioNivel.DIRETOR],
      [UsuarioNivel.SUPERVISOR]: UsuarioNivel[UsuarioNivel.SUPERVISOR],
      [UsuarioNivel.ADMINISTRADOR]: UsuarioNivel[UsuarioNivel.ADMINISTRADOR],
    }
  };
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
