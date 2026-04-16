import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Tabela } from '@app/_dto';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class TabelasService {
  private http = inject(HttpClient);
  
  public getGrauInstrucao() {
    return httpResource<Tabela[]>(() => environment.api + 'grau-instrucao/ativos')
  }

  public getTipoAposentadoria() {
    return httpResource<Tabela[]>(() => environment.api + 'tipo-aposentadoria/ativos')
  }

  public getEstadoCivil() {
    return httpResource<Tabela[]>(() => environment.api + 'estado-civil/ativos')
  }

  public getTipoCadastro() {
    return httpResource<Tabela[]>(() => environment.api + 'tipo-cadastro/ativos')
  }

  public getCargos() {
    return httpResource<Tabela[]>(() => environment.api + 'cargos/ativos')
  }

  public getOrgaos() {
    return httpResource<Tabela[]>(() => environment.api + 'orgaos/ativos')
  }

  public getBeneficiariosCount() {
    //return this.http.get(environment.api + 'beneficiarios/count', {  responseType: 'text' })
    return httpResource.text(() => environment.api + 'beneficiarios/count');
  }
}
