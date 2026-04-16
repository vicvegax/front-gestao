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
        const dir = params!['dir'] || 'asc';

        let result = [...filtered]
        if(sort) {
          result.sort((a: any, b: any) => {
            const res = a[sort] < b[sort] ? -1 : 1;
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
