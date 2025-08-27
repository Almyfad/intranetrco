import { Component, Inject, inject, Input } from '@angular/core';
import {
    MatSnackBarAction,
    MatSnackBarActions,
    MatSnackBarLabel,
    MatSnackBarRef,
    MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { TablerIconsModule } from "angular-tabler-icons";

/**
 * @title Snack-bar with an annotated custom component
 */
@Component({
    selector: 'snack-bar-annotated-component-example',
    imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction, TablerIconsModule],
    styles: `
    @import 'src/assets/scss/variables';
    :host {
      display: flex;
      align-items: center;
    }
    .icon {
      width: 24px;
      height: 24px;
      margin-left: 5px;
    }
    .iconwhite {
      color: $white;
    }
  `,
    template: `
    <div class="icon">
        <i-tabler name="{{ data.icon }}"></i-tabler>
    </div>
    <span matSnackBarLabel>{{ data.message }}</span>
    <span matSnackBarActions>
        <button mat-button matSnackBarAction (click)="snackBarRef.dismissWithAction()">
            <i-tabler name="x" class="iconwhite"></i-tabler>
        </button>
    </span>`
})
export class SnackBarComponent {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData ,
        public snackBarRef: MatSnackBarRef<SnackBarComponent>
    ) { }
}

interface SnackBarData {
    message: string;
    icon: string | undefined;
}