import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import Decimal from 'decimal.js';

const corCredito = '!text-blue-700';
const corDebito = '!text-red-500';

@Pipe({
  name: 'valorDC'
})
export class ValorPipe implements PipeTransform {

  transform(value: Decimal | undefined, cor?: 'C' | 'D' | 'DC'): string {
    if(cor) {
      if(!value || value.lessThan(0) || cor == 'D') return corDebito;
      return corCredito;
    } else {
      if (!value || value.isZero()) return '0,00';
      
      const valuesAbs = value.abs().toNumber()
      // Formata para o padrão brasileiro: '1.765,12'
      return formatNumber(valuesAbs, 'pt-BR', '1.2-2') + ' ' + (value.lessThan(0) ? 'D' : 'C');
    }
  }

}
