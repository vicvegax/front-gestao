import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private snackBar: MatSnackBar) { }

  // Configuração base para todos os SnackBars
  private config: MatSnackBarConfig = {
    duration: 3000, 
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  /**
   * Exibe uma mensagem de sucesso (verde).
   * @param message A mensagem a ser exibida.
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      ...this.config,
      panelClass: ['success-snackbar'] // Classe CSS para sucesso
    });
  }

  /**
   * Exibe uma mensagem de aviso (amarelo).
   * @param message A mensagem a ser exibida.
   */
  showWarning(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      ...this.config,
      panelClass: ['warning-snackbar'] // Classe CSS para aviso
    });
  }

  /**
   * Exibe uma mensagem de erro (vermelho).
   * @param message A mensagem a ser exibida.
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      ...this.config,
      
      panelClass: ['error-snackbar'] // Classe CSS para erro
    });
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}