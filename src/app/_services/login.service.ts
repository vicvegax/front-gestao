import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioAuthDto } from '@app/_dto';
import { environment } from '@env/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private storage = 'solucao';

  private usuarioSubject: BehaviorSubject<UsuarioAuthDto | null>;
  public usuario: Observable<UsuarioAuthDto | null>;

  private routes = inject(Router);
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  
  constructor() {
    this.usuarioSubject = new BehaviorSubject<UsuarioAuthDto | null>(JSON.parse(localStorage.getItem(this.storage)!));
    this.usuario = this.usuarioSubject.asObservable();
  }

  public get usuarioValue(): UsuarioAuthDto | null {
    return this.usuarioSubject.value;
  }
  
  login(cpf: string, senha: string) {
    return this.http.post<UsuarioAuthDto>(environment.api + `login`, { cpf, senha })
      .pipe(map(usuario => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem(this.storage, JSON.stringify(usuario));
        this.usuarioSubject.next(usuario);
        return usuario;
      }));
  }

  logout(returnUrl?: string) {
    // remove user from local storage and set current user to null
    localStorage.removeItem(this.storage);
    this.usuarioSubject.next(null);
    // close any open dialogs (e.g., BuscaPaciente) before navigating to login
    try {
      this.dialog.closeAll();
    } catch (e) {
      // defensive: if MatDialog isn't available for some reason, ignore
    }
    this.routes.navigate(['/login'], returnUrl && returnUrl != '/' ? { queryParams: { returnUrl } } : undefined);
  }
}
