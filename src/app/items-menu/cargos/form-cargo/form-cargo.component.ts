import { Component, inject, Input } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule, MatSelectTrigger } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { BaseFormComponent, UppercaseDirective, CustomFormComponent } from '@app/_helpers';
import { CargoAllDto as DataDto } from '@app/_dto';


@Component({
  selector: 'form-cargo',
  templateUrl: './form-cargo.component.html',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule, MatSelectTrigger,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    UppercaseDirective,
    CustomFormComponent
]
})
export class FormCargo extends BaseFormComponent<DataDto> {
  @Input() set registro(dados: DataDto | undefined) {
    this.modoEditar.set(!!dados?.id);
    if (this.modoEditar()) {
      this.form.patchValue(dados!);
    } else {
      this.form.reset({ ativo: true });
    }
  }

  private fb = inject(FormBuilder);
  form = this.fb.group({
    id: [0],
    nome: ['', [Validators.required, Validators.minLength(3)]],
    obs: [''],
    ativo: [true]
  });

  get f() { return this.form.controls }

  ngOnInit() {
    this.setupError('nome', 'conflict');
  }

  onSalvarClick(): void {
    if(!this.loading()) this.salvar.emit(this.form.value as DataDto);
  }

  onVoltarClick() {
    this.voltar.emit()
  }
}
