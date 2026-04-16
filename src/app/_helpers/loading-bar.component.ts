import {Component, input} from '@angular/core'
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'loading-bar',
  imports: [
    MatProgressBarModule
  ],
  template: `
  @if (visible()) {
    <mat-progress-bar color="primary" mode="indeterminate"> </mat-progress-bar>
  }`,
  styles: ``
})
export class LoadingBarComponent {
  visible = input.required<boolean>();
}