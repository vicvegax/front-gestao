import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { LoginService, ToasterService, UsuarioService } from '@app/_services';
import { Router } from '@angular/router';


@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrl: './alterar-senha.component.scss',
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule, MatError
  ]
})
export class AlterarSenhaComponent {
  private readonly router = inject(Router);
  // private readonly dialog = inject(DialogService);
  protected toaster = inject(ToasterService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly loginService = inject(LoginService);

  private readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    senhaAtual: [null, Validators.required],
    novaSenha: [null, [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(this.passwordPattern)
    ]],
    confirmaSenha: [null, Validators.required],
  }, { validators: this.checkPasswords });


  checkPasswords(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('novaSenha')?.value;
    const confirmControl = group.get('confirmaSenha');

    // Se um dos dois ainda não existe ou está vazio, não valida ainda
    if (!pass || !confirmControl?.value) {
      return null;
    }

    if (pass !== confirmControl.value) {
      // 1. INJETA O ERRO NO CAMPO ESPECÍFICO
      // Isso faz o mat-form-field ficar vermelho
      confirmControl.setErrors({ ...confirmControl.errors, notSame: true });
      
      // Retorna erro para o grupo também (opcional, mas bom para debug)
      return { notSame: true };
    } else {
      // 2. LIMPEZA OBRIGATÓRIA
      // Se corrigiu, precisamos remover o erro 'notSame' manualmente, 
      // mantendo outros erros (como 'required') se existirem.
      if (confirmControl.hasError('notSame')) {
        delete confirmControl.errors?.['notSame'];
        
        // Se não sobrou nenhum erro, define como null para ficar válido
        if (Object.keys(confirmControl.errors || {}).length === 0) {
          confirmControl.setErrors(null);
        }
      }
      return null;
    }
  }

  onSubmit(): void {
    if(this.form.invalid) return;
    if(!this.loginService.usuarioValue) return;

    const id = this.loginService.usuarioValue.id;
    const senhaAtual = this.f['senhaAtual'].value || '';
    const novaSenha = this.f['novaSenha'].value || '';

    this.usuarioService.alterarSenha(id, senhaAtual, novaSenha)
      .subscribe({
        next: () => {
          this.toaster.showSuccess('Senha Alterada com Sucesso.');
          this.form.reset();
          this.loginService.logout();
        },
        error:(err) => {
            // console.error(err);
          if (err.status === 400) {
            this.toaster.showError('A senha atual está incorreta.');
          } else {
            this.toaster.showError('Ocorreu um erro Alterando a Senha.');
            console.error(err);
          }
        }
      });
  }

  get f() { return this.form.controls }

}
