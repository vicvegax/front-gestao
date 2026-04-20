import { DataSource } from '@angular/cdk/collections';
import { signal, inject, computed } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

export abstract class BaseDataSource<T> extends DataSource<T> {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected queryParams = toSignal(this.route.queryParams);

  // abstract fetchAll(): Observable<T>;

  abstract loadData(): Promise<void>;

  // Estado principal usando Signals
  readonly dataSignal = signal<T[]>([]);
  readonly filterSignal = signal<string>('');
  readonly filteredData = computed(() => {
    let result = [...this.dataSignal()];
    const search  = this.filterSignal();

    if (search) {
      result = result.filter(item => 
        JSON.stringify(item).toLowerCase().includes(search)
      );
    }
    return result;
  });

  set filter(value: string) { 
    if(value !== this.filterSignal()) {
      this.filterSignal.set(value.trim().toLowerCase());
        this.updateParams({ page: 0 });
    }
  }

  updateParams(newParams: any) {
    if(newParams.dir === '') {
      newParams.sort = undefined;
      newParams.dir = undefined;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: newParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  connect(): Observable<T[]> {
    return combineLatest([
      toObservable(this.filteredData),
      toObservable(this.queryParams),
    ]).pipe(
      map(([filtered, params]) => {
        const page = +(params!['page'] || 0);
        const size = +(params!['size'] || 25);
        const sort = params!['sort'];
        const dir = params!['dir'];// || 'asc';

        let result = [...filtered]
        if (sort && dir) {
          result.sort((a: any, b: any) => {
            if (!(sort in a) || !(sort in b)) {
              console.warn(`Ordenação ignorada: propriedade '${sort}' não existe em todos os registros.`);
              return 0;
            }

            const aVar = a[sort];
            const bVar = b[sort];
            const sortA = aVar && typeof aVar === 'object' ? aVar['nome'] ?? aVar : aVar;
            const sortB = bVar && typeof bVar === 'object' ? bVar['nome'] ?? bVar : bVar;

            if (sortA == null && sortB == null) return 0;
            if (sortA == null) return dir === 'asc' ? 1 : -1;
            if (sortB == null) return dir === 'asc' ? -1 : 1;

            const res = sortA < sortB ? -1 : sortA > sortB ? 1 : 0;
            return dir === 'asc' ? res : -res;
          });
        }

        const start = page * size;
        return result.slice(start, start + size);

      })
    );
  }

  disconnect(): void {}
}
