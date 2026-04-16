import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardSubtitle } from "@angular/material/card";
import { MatIcon } from '@angular/material/icon';
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@app/_services';
import { ToasterService } from '@app/_services/toaster.service';
import { environment } from '@env/environment';
import { NgxMaskDirective } from "ngx-mask";

@Component({
  selector: 'app-login',
  imports: [
    MatCard, MatCardHeader, MatCardTitle, MatCardContent, ReactiveFormsModule, MatError, MatLabel,
    MatFormField, MatInput, MatButton, MatProgressSpinnerModule, MatIcon, MatIcon, MatSuffix, MatIconButton,
    NgxMaskDirective,
    // MatCardSubtitle
],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  modoDev = environment.modoDev;

  submitted = false;
  loading = false;
  error?: string;
  visiblePassword = false;

  //INICIALIZAÇÕES
  private toaster = inject(ToasterService);

  private fb = inject(FormBuilder);
  loginForm = this.fb.group({
    cpf: ['', [Validators.required]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
  });

  loginService = inject(LoginService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  //MÉTODOS
  constructor() {
    // redirect to home if already logged in
    if (this.loginService.usuarioValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    if(environment.modoDev) {
      this.f.cpf.setValue('01124791388');
      this.f.senha.setValue('01124791388');
    }
  }

  submit() {
    try {
      this.submitted = true;
      this.error = '';

      if (this.loginForm.invalid) {
        return;
      }

      this.loading = true;

      this.loginService.login(this.f.cpf.value!, this.f.senha.value!)
        .subscribe({
          next: () => {
            // login successful
            this.toaster.dismiss()
            const returnUrl =this.route.snapshot.queryParams['returnUrl'] ||  '/';
            this.router.navigateByUrl(returnUrl);
          },
          error: err => {
            if(err.status == 401) {
              this.error = 'CPF ou senha inválidos.';
            } else {
              console.error(err);
              this.error = 'Ocorreu um erro. Tente novamente mais tarde.';
            }
            this.toaster.showError(this.error);
            this.loading = false;
          }
        });

    } finally {
      // this.loading = false;
    }
  }

  get f() { return this.loginForm.controls; }
}
