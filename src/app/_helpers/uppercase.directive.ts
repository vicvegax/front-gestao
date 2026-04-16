import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[toUppercase]' // Use as an attribute, e.g., <input toUppercase>
})
export class UppercaseDirective {
  constructor(private readonly control: NgControl, private readonly el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const caretPos = inputElement.selectionStart;
    const transformedValue = inputElement.value.toUpperCase();
    
    this.control.control?.setValue(transformedValue, { emitEvent: false });
    
    // Restore caret position
    if (caretPos !== null) {
      inputElement.setSelectionRange(caretPos, caretPos);
    }
  }
}
