import { Component, input, output} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'custom-form',
  templateUrl: './custom-form.component.html',
  imports: [
    MatCardModule, MatButtonModule
  ]
})
export class CustomFormComponent {
  salvar = output<void>();
  voltar = output<void>();
  canSave = input.required<boolean>();
  loading = input.required<boolean>();

  onSalvarClick() {
    if(!this.loading()) this.salvar.emit();
  }

  onVoltarClick() {
    this.voltar.emit();
  }
}