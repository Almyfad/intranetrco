import { ChangeDetectionStrategy, Component, computed, inject, Input, model, OnChanges, signal, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormsModule } from '@angular/forms';
import { Observable, of, tap } from 'rxjs';
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

  @Input() label: string = 'autocomplete-chips';
  @Input() placeholder: string = 'autocomplete-chips-placeholder';
  @Input() formControlName: string = 'autocomplete-chips-form-control-name';
  @Input() items: T[] | null | undefined;
  @Input() asyncItems: ((arg0: string | null | undefined) => Observable<T[]>) | undefined;
  @Input() keySelector!: ((args: T | undefined) => string);
  @Input() displayWith!: ((args: T | undefined) => string);



  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentPattern = signal<string | undefined | null>(null);
  readonly selectedItems = model<T[]>([]);
  readonly filteredItems = computed(() => {
    const currentItem = this.currentPattern()?.toUpperCase();

    if (this.asyncItems) {
      return this.asyncItems(currentItem).pipe(
        tap(x => this.items = x))
    }
    else
      return of((currentItem
        ? this.items?.filter(x => this.displayWith(x).toUpperCase().includes(currentItem))
        : this.items?.slice())
        ?.filter(x => !this.selectedItems().map(s => this.keySelector(s)).includes(this.keySelector(x))))
        ;
  });

  readonly announcer = inject(LiveAnnouncer);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && changes['items'].currentValue && changes['items'].currentValue.length > 0) {
      // Set `currentPattern` to an empty string to trigger filtering when `items` is populated
      this.currentPattern.set(undefined);
      this.currentPattern.set(null);
    }
  }


  add(event: MatChipInputEvent): void {
    if (event.value) {
      this.selectedItems.update(x => [...x, event.value as T]);
    }
    // Clear the input value
    this.currentPattern.set("");

  }

  remove(item: T): void {
    this.selectedItems.update(items => {
      const index = items.indexOf(item);
      if (index < 0) {
        return items;
      }

      items.splice(index, 1);
      this.announcer.announce(`Removed ${item}`);
      return [...items];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedItems.update(x => [...x, event.option.value]);
    this.currentPattern.set("");
    event.option.deselect();
  }


}
