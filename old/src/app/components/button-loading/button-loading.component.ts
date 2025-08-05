import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';


enum Types {
  Raised,
  Stroked,
  Flat }

@Component({
  selector: 'app-button-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule,MatButtonModule,MatIconModule],
  templateUrl: './button-loading.component.html',
  styleUrl: './button-loading.component.scss'
})
export class ButtonLoadingComponent {
  loading = false;
  click() {
    this.loading = true;
    this.observe?.subscribe({
      complete: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  @Input() observe: Observable<any> | null = null;
  @Input() type: Types = Types.Raised;
  @Input() icon: string | null = null;

  get isStroked() { return this.type === Types.Stroked }
  get isFlat() { return this.type === Types.Flat }
  get isRaised() { return this.type === Types.Raised }

}
