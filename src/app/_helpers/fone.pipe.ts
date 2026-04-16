import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fone',
  standalone: true
})
export class FonePipe implements PipeTransform {

  transform(value: string | null): string {
    if(!value) return '';
    if(value.length == 9) return value.replace(/(\d{5})(\d{4})/, "$1-$2");
    if(value.length == 11) return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    return value;
  }

}