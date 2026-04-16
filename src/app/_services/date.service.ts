import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { formatDate, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DateService {
  private readonly locale = inject(LOCALE_ID);
  private readonly config = inject(DATE_PIPE_DEFAULT_OPTIONS);

  /**
   * Formata uma data usando o fuso horário padrão do sistema
   */
  format(date: Date | string | number | null, format = 'dd/MM/yyyy'): string {
    if(!date) return '';
    return formatDate(
      date, 
      format, 
      this.locale, 
      this.config?.timezone ?? 'UTC'
    );
  }
}
