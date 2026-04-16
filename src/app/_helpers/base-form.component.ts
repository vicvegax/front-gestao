// src/app/_forms/base-form.component.ts

import { Directive, input, OnDestroy, output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive() // Use @Directive para que não precise de um template
export abstract class BaseFormComponent<T = any> implements OnDestroy {
  modoEditar = signal<boolean>(false);
  voltar = output<void>();
  salvar = output<T>();
  loading = input.required<boolean>();

  // Força as classes filhas a terem uma propriedade 'form'
  abstract form: FormGroup; //DEVER SER HERDADO!!!

  private destroyed$ = new Subject<void>();

  protected setupError(controlName: string, errorName: string): void {
    const control = this.form.get(controlName);
    if(!control) {
      throw new Error(`Controle '${controlName}' não encontrado no formulário.`);
    }

    control.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        if (control.hasError(errorName)) {
          const currentErrors = { ...control.errors };
          delete currentErrors[errorName];

          control.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
        }
      });
  }

  /**
   * Define um erro em um campo específico do formulário.
   * @param fieldName O nome do controle (pode usar notação de ponto, ex: 'especialidade.id').
   * @param error O objeto de erro a ser definido (ex: { conflict: 'Horário já ocupado' }).
   */
  public setFieldError(fieldName: string, error: { [key: string]: any }): void {
    // console.warn(`Definindo erro no campo '${fieldName}':`, error);
    this.form.get(fieldName)?.setErrors(error);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    // console.warn('BaseForm destroy!');
  }
  // Você pode adicionar outras lógicas comuns aqui no futuro, como:
  // - um getter para 'submitted'
  // - uma função para marcar todos os campos como 'touched'
}