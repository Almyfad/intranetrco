import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from "angular-tabler-icons";

export interface AsyncSelectOption {
    value: any;
    label: string;
    icon?: string;
    iconColor?: string;
}

@Component({
    selector: 'app-async-select',
    standalone: true,
    imports: [
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        MatProgressSpinnerModule,
        MatIconModule,
        ReactiveFormsModule,
        TablerIconsModule
    ],
    templateUrl: './async-select.component.html',
    styleUrl: './async-select.component.scss'
})
export class AsyncSelectComponent implements OnInit {
    @Input() label: string = 'Sélectionner';
    @Input() placeholder: string = 'Choisissez une option';
    @Input() clearOptionText: string = 'Aucun filtre';
    @Input() multiple: boolean = false;
    @Input() options$!: Observable<AsyncSelectOption[]>;
    @Input() loading$: Observable<boolean> = new BehaviorSubject(false);

    @Output() selectionChange = new EventEmitter<any>();

    selectControl = new FormControl();

    ngOnInit(): void {
        this.selectControl.valueChanges.subscribe(value => {
            this.selectionChange.emit(value);
        });
    }

    /**
     * Permet de définir la valeur sélectionnée depuis l'extérieur
     */
    setValue(value: any): void {
        this.selectControl.setValue(value);
    }

    /**
     * Réinitialise la sélection
     */
    clear(): void {
        this.selectControl.setValue(this.multiple ? [] : '');
    }
}
