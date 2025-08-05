import { ChangeDetectionStrategy, Component, computed, effect, Input, model, OnChanges, signal, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-autocomplete-chips',
  standalone: true,
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule, FormsModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './autocomplete-chips.component.html',
  styleUrl: './autocomplete-chips.component.scss'
})
export class AutocompleteChipsComponent<T> implements OnChanges {

  @Input({ required: true }) options!: AutocompleteChipsInput<T>;

  constructor() {
    effect(() => {
      const items = this.selectedIAutoCompleteChipsItems();
      this.selectedItems.set(items.map(x => x.item));
    }, { allowSignalWrites: true });
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentPattern = signal<string | undefined | null>(null);
  readonly selectedIAutoCompleteChipsItems = model<AutocompleteChipsItem<T>[]>([]);
  readonly selectedItems = model<T[]>([]);

  readonly filteredItems = computed(() => {
    const currentItem = this.currentPattern()?.toUpperCase();
    return this.options.datasource.buildDataSource(currentItem).pipe(
      map((s) => s.filter(x => !this.selectedIAutoCompleteChipsItems().map(s => s.id).includes(x.id)))
    );
  });


  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && changes['items'].currentValue && changes['items'].currentValue.length > 0) {
      // Set `currentPattern` to an empty string to trigger filtering when `items` is populated
      this.currentPattern.set(undefined);
      this.currentPattern.set(null);
    }
  }
  add(event: MatChipInputEvent): void {
    if (event.value) {
      this.selectedIAutoCompleteChipsItems.update(x => [...x, event.value as unknown as AutocompleteChipsItem<T>]);
    }
    // Clear the input value
    this.currentPattern.set("");

  }

  remove(item: AutocompleteChipsItem<T>): void {
    this.selectedIAutoCompleteChipsItems.update(items => {
      const index = items.indexOf(item);
      if (index < 0) {
        return items;
      }

      items.splice(index, 1);
      return [...items];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedIAutoCompleteChipsItems.update(x => [...x, event.option.value]);
    this.currentPattern.set("");
    event.option.deselect();
  }


}

export class AutocompleteChipsItem<T> {
  id!: string | number;
  displayWith?: string | undefined | null;
  displayAvatar?: string | undefined | null;
  item!: T;
}

export class AutocompleteChipsDataSource<T> {
  data?: AutocompleteChipsItem<T>[] | undefined;
  asyncDataPatern?: ((arg0: string | null | undefined) => Observable<AutocompleteChipsItem<T>[]>) | undefined;
  asyncData?: Observable<AutocompleteChipsItem<T>[]> | undefined;


  private filter(patern: string | null | undefined, data: Observable<AutocompleteChipsItem<T>[]> | undefined) {
    return data?.pipe(
      map((data) => data.filter(x => x.displayWith?.toUpperCase().includes(patern?.toUpperCase() ?? '')))
    );
  }
  constructor({
    data,
    asyncData,
    asyncDataPatern
  }: {
    data?: AutocompleteChipsItem<T>[] | undefined;
    asyncData?: Observable<AutocompleteChipsItem<T>[]> | undefined;
    asyncDataPatern?: ((arg0: string | null | undefined) => Observable<AutocompleteChipsItem<T>[]>) | undefined;
  }) {
    this.data = data;
    this.asyncData = asyncData;
    this.asyncDataPatern = asyncDataPatern;
  }
  buildDataSource(patern?: string | null) {
    let data$ = this.data ? this.filter(patern, of(this.data)) : undefined;
    let asyncData$ = this.asyncData ? this.filter(patern, this.asyncData) : undefined;
    let asyncDataPatern$ = this.asyncDataPatern ? this.asyncDataPatern(patern) : undefined;

    let validObservables: Observable<AutocompleteChipsItem<T>[]>[] = [
      data$,
      asyncData$,
      asyncDataPatern$
    ].filter(obs => obs !== undefined) as Observable<AutocompleteChipsItem<T>[]>[]; // filtre les observables valides

    return combineLatest(validObservables).pipe(
      map(results => results.flat())
    )
  }
}

export type AutocompleteChipsInput<T> = {
  label: string;
  placeholder: string;
  formControlName: string;
  datasource: AutocompleteChipsDataSource<T>;
}