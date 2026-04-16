import { Directive, inject, signal } from "@angular/core";
import { BaseDataSource } from "@app/_helpers/base-datasource";
import { ToasterService } from "@app/_services";

@Directive() // Use @Directive para que não precise de um template
export abstract class BaseComponent<T, R=T> {
  
  showForm = signal(false);
  loading = signal(false);

  registro: T | R | undefined;

  abstract dataSource: BaseDataSource<T>;
  // abstract dataSource: any;

  loadData() {
    this.loading.set(true);
    this.dataSource.loadData().finally(() => this.loading.set(false));
  }

  hideForm(refresh: boolean = false) {
    this.showForm.set(false);
    this.dataSource.filter = '';
    if(refresh) this.loadData();
  }

  onNovoClick() {
    this.registro = undefined;// {} as R;
    this.showForm.set(true);
  }

  onEditarClick(row: T) {
    this.registro = row;
    this.showForm.set(true);
  }

  protected toaster = inject(ToasterService);

  protected showErrorToast(message: string): void {
    this.toaster.showError(message);
  }

  protected showSuccessToast(message: string): void {
    this.toaster.showSuccess(message);
  }
}