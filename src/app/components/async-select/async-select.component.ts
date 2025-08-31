import { Component, computed, EventEmitter, forwardRef, inject, Input, input, model, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from "angular-tabler-icons";

export interface SelectOption<T> {
    value: T;
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
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AsyncSelectComponent),
            multi: true
        }
    ],
    templateUrl: './async-select.component.html',
    styleUrl: './async-select.component.scss'
})
export class AsyncSelectComponent<T> {
    @Input() label: string = 'Sélectionner';
    @Input() placeholder: string = 'Choisissez une option';
    @Input() clearOptionText: string = 'Aucun filtre';
    @Input() multiple: boolean = false;
    @Input() compareWith?: (a: T | null, b: T | null) => boolean;
    @Output() selectionChange = new EventEmitter<T | T[] | null>();
    values = model<T | T[] | null>(this.multiple ? [] : null);
    readonly fb = inject(FormBuilder);

    loading = input(false);
    options = input.required<SelectOption<T>[] | null>();

    // FormControl interne utilisé par le template
    selectControl = this.fb.control<T | T[] | null>(this.multiple ? [] : null);
    private onChange: (v: any) => void = () => { };
    private onTouched: () => void = () => { };
    private isDisabled = false;

    constructor() {
        // Propager les changements du FormControl interne vers le form control parent
        this.selectControl.valueChanges.subscribe(value => {
            this.onChange(value);
            this.selectionChange.emit(value);
            this.values.set(value);
        });
    }
    // ControlValueAccessor methods
    writeValue(value: any): void {
        // Ne pas émettre valueChanges lors de la mise à jour par writeValue
        this.selectControl.setValue(value, { emitEvent: false });
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
        if (isDisabled) {
            this.selectControl.disable({ emitEvent: false });
        } else {
            this.selectControl.enable({ emitEvent: false });
        }
    }

    // méthodes utilitaires pour template / API externe
    // Permet de définir la valeur sélectionnée depuis l'extérieur
    setValue(value: T): void {
        this.writeValue(value);
        this.onChange(value);
        this.selectionChange.emit(value);
        this.values.set(value);
    }

    // Réinitialise la sélection
    clear(): void {
        const val = this.multiple ? [] : null;
        this.writeValue(val);
        this.onChange(val);
        this.selectionChange.emit(val);
        this.values.set(val);
    }

    // à appeler depuis le template (ex: (blur))
    markTouched(): void {
        this.onTouched();
    }

    compareWithFn = (o1: T | null, o2: T | null): boolean => {
        if (this.compareWith) return this.compareWith(o1, o2);
        if (o1 === o2) return true;
        if (o1 && o2 && typeof o1 === 'object' && typeof o2 === 'object') {
            const a = o1 as any, b = o2 as any;
            if ('id' in a && 'id' in b) return a.id === b.id;
        }
        return false;
    }
}

