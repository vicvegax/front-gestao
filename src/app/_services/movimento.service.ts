import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { Decimal } from 'decimal.js';
import { Movimento, MovimentoDashBoardDto, MovimentoDto, MovimentoListResponse } from '@app/_dto';
import { DateTime } from "luxon";

@Injectable({
  providedIn: 'root'
})
export class MovimentoService {
  http = inject(HttpClient);
  private readonly rota = 'movimento';

  public getAll(conta: number, dataInicial: string, dataFinal: string): Observable<MovimentoListResponse<Movimento>> {
    return this.http
      .get<MovimentoListResponse<MovimentoDto>>(environment.api + this.rota, {params: {conta, dataInicial, dataFinal}})
      .pipe(
        map(res => {
          const data = res.data.map(item => ({
            ...item,
            valor: new Decimal(item.valor as unknown as string),
            dataVencimento: DateTime.fromISO(item.dataVencimento),
            dataBaixa: item.dataBaixa ? DateTime.fromISO(item.dataBaixa) : undefined,
            dataEfetivou: item.dataEfetivou ? DateTime.fromISO(item.dataEfetivou) : undefined,
            dataEntregou: item.dataEntregou ? DateTime.fromISO(item.dataEntregou) : undefined,
          }));

          return {
            anterior: this.decodeBase64(res.anterior),
            credito: this.decodeBase64(res.credito),
            debito: this.decodeBase64(res.debito),
            emConta: this.decodeBase64(res.emConta),
            data,
          } as MovimentoListResponse<Movimento>;
        })
      );
  }

  public getDashboard() {
    return httpResource<MovimentoDashBoardDto>(
      () => environment.api + this.rota + '/dashboard',
      {
        parse: (body: unknown) => this.parseDashboard(body),
      },
    );
  }

  public save(data: Movimento): Observable<Movimento> {
    if (data.id) {
      return this.http.patch<Movimento>(environment.api + this.rota + '/' + data.id, data)
    }
    
    return this.http.post<Movimento>(environment.api + this.rota, data)
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

  private decodeBase64(value: unknown): string {
    if (typeof value !== 'string') {
      throw new Error('Dashboard value must be a Base64 string')
    }

    return atob(value);
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
