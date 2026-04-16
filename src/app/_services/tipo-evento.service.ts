import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { TipoEventoAllDto as DataDto, TipoEventoAtivoDto as AtivoDto } from '@app/_dto';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  http = inject(HttpClient);

  public getAll(): Observable<DataDto[]> {
    return this.http.get<DataDto[]>(environment.api + 'tipo-evento')
  }

  public getDisponivel(): Observable<AtivoDto[]> {
    return this.http.get<AtivoDto[]>(environment.api + 'tipo-evento/ativos')
  }

  public save(data: DataDto): Observable<DataDto> {
    if (data.id) {
      return this.http.patch<DataDto>(environment.api + 'tipo-evento/' + data.id, data)
    }
    
    return this.http.post<DataDto>(environment.api + 'tipo-evento', data)
  }

  // public total(): Observable<number> {
  //   return this.http.get<number>(environment.api + 'tipo-vinculo/total')
  // }
}
