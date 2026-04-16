import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Decimal } from 'decimal.js';
import { MovimentoDashBoardDto, MovimentoDto } from '@app/_dto';

@Injectable({
  providedIn: 'root'
})
export class MovimentoService {
  http = inject(HttpClient);
  private readonly rota = 'movimento';

  public getAll(): Observable<MovimentoDto[]> {
    return this.http.get<MovimentoDto[]>(environment.api + this.rota)
  }

  public getDashboard() {
    return httpResource<MovimentoDashBoardDto>(
      () => environment.api + this.rota + '/dashboard',
      {
        parse: (body: unknown) => this.parseDashboard(body),
      },
    );
  }

  public save(data: MovimentoDto): Observable<MovimentoDto> {
    if (data.id) {
      return this.http.patch<MovimentoDto>(environment.api + this.rota + '/' + data.id, data)
    }
    
    return this.http.post<MovimentoDto>(environment.api + this.rota, data)
  }

  private parseDashboard(body: unknown): MovimentoDashBoardDto {
    if (!body || typeof body !== 'object') {
      throw new Error('Invalid dashboard payload')
    }

    const raw = body as Record<string, unknown>
    return {
      anterior: this.decodeBase64Decimal(raw['anterior']),
      credito: this.decodeBase64Decimal(raw['credito']),
      debito: this.decodeBase64Decimal(raw['debito']),
      em_conta: this.decodeBase64Decimal(raw['em_conta']),
    }
  }

  private decodeBase64Decimal(value: unknown): Decimal {
    if (typeof value !== 'string') {
      throw new Error('Dashboard value must be a Base64 string')
    }

    return new Decimal(atob(value))
  }

  // public total(): Observable<number> {
  //   return this.http.get<number>(environment.api + 'tipo-vinculo/total')
  // }
}
