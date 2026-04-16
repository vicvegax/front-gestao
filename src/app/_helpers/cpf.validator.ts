import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value;
    if (!cpf) {
      return null;
    }

    const cleanedCpf = cpf.replace(/\D/g, '');

    if (cleanedCpf.length !== 11) {
      return { cpfInvalid: true };
    }

    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanedCpf)) {
      return { cpfInvalid: true };
    }

    // Calculate first check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedCpf[i]) * (10 - i);
    }
    let remainder = sum % 11;
    let firstCheck = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cleanedCpf[9]) !== firstCheck) {
      return { cpfInvalid: true };
    }

    // Calculate second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedCpf[i]) * (11 - i);
    }
    remainder = sum % 11;
    let secondCheck = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cleanedCpf[10]) !== secondCheck) {
      return { cpfInvalid: true };
    }

    return null;
  };
}