import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { UsuarioAllDto as DataDto } from '@app/_dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  http = inject(HttpClient);

  public getAll(): Observable<DataDto[]> {
    return this.http.get<DataDto[]>(environment.api + 'usuarios')
  }

  public save(data: DataDto): Observable<DataDto> {
    if (data.id) {
      return this.http.patch<DataDto>(environment.api + 'usuarios/' + data.id, data)
    }
    
    return this.http.post<DataDto>(environment.api + 'usuarios', data)
  }

  public alterarSenha(id: number, senhaAtual: string, novaSenha: string) {
    return this.http.post(environment.api + 'usuarios/alterar-senha', { id, senhaAtual, novaSenha });
  }
}
