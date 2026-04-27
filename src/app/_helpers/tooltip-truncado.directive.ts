import { Directive, HostListener, inject, ElementRef, Renderer2 } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[tooltipSeTruncado]',
  standalone: true
})
export class TooltipTruncadoDirective {
  private tooltip = inject(MatTooltip);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('mouseenter')
  onMouseEnter() {
    const target = this.el.nativeElement;
    const estaTruncado = target.scrollWidth > target.clientWidth;
    
    this.tooltip.disabled = !estaTruncado;

    // Gerencia o cursor dinamicamente
    if (estaTruncado) {
      this.renderer.addClass(target, '!cursor-help');
    } else {
      this.renderer.removeClass(target, '!cursor-help');
    }
  }
}
