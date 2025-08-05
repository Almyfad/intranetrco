import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  template: `
    <div (click)="handleClick($event)">
      <ng-content></ng-content>
    </div>
  `,
})
export class DeleteConfirmComponent {
  @Input() title: string = 'Confirmation';
  @Input() message: string = 'Êtes-vous sûr de vouloir supprimer cet élément ?';
  @Input() confirmButtonText: string = 'Supprimer';
  @Input() cancelButtonText: string = 'Annuler';

  @Output() confirm = new EventEmitter<void>();
  private dialog = inject(MatDialog);

  handleClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        title: this.title,
        message: [this.message],
        actions: [
          { label: this.cancelButtonText, initial: false, callback: undefined },
          { label: this.confirmButtonText, initial: true, callback: () => this.confirm.emit() }
        ]
      }
    });
  }
}
