import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { ContasAllDto as DataDto, ContaAtivoDto as AtivoDto } from '@app/_dto';

@Injectable({
  providedIn: 'root'
})
export class ContaService {
  http = inject(HttpClient);

  public getAll(): Observable<DataDto[]> {
    return this.http.get<DataDto[]>(environment.api + 'orgaos')
  }

  public getAtivos(): Observable<AtivoDto[]> {
    return this.http.get<AtivoDto[]>(environment.api + 'contas/ativos')
  }

  public save(data: DataDto): Observable<DataDto> {
    if (data.id) {
      return this.http.patch<DataDto>(environment.api + 'orgaos/' + data.id, data)
    }
    
    return this.http.post<DataDto>(environment.api + 'orgaos', data)
  }

  // public total(): Observable<number> {
  //   return this.http.get<number>(environment.api + 'tipo-vinculo/total')
  // }
}
