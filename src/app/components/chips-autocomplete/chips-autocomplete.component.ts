import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, computed, effect, inject, Input, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, firstValueFrom, Observable } from 'rxjs';


export interface Chip<T> {
  id: number;
  name: string;
  value: T;
}

@Component({
  selector: 'app-chips-autocomplete',
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule, FormsModule],
  templateUrl: './chips-autocomplete.component.html',
  styleUrl: './chips-autocomplete.component.scss'
})
export class ChipsAutocompleteComponent<T> {
  @Input() options!: (pattern: string) => Observable<Chip<T>[]>;
  @Input() placeholder: string = 'Tapez pour rechercher';
  @Input() label: string | undefined;


  items = model([] as Chip<T>[]);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentItem = model<string>('');

  currentItem$ = toObservable(this.currentItem);
  debounced$ = this.currentItem$.pipe(debounceTime(300));
  debouncedCurrentItem = toSignal(this.debounced$, { initialValue: '' })
  filteredItems = signal([] as Chip<T>[]);
  readonly announcer = inject(LiveAnnouncer);

  fetchData = (pattern: string) => firstValueFrom(this.options(pattern));
  constructor() {
    effect(() => {
      const pattern = this.debouncedCurrentItem().toLowerCase();
      if (pattern.length < 3) return;
      this.fetchData(pattern).then(items => {
        this.filteredItems.set(items);
      });
    });
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    console.log(value);
    if (value) {
      // this.items.update(x => [...x, value]);
    }

    // Clear the input value
    this.currentItem.set('');
  }

  remove(item: Chip<T>): void {
    this.items.update(fruits => {
      const index = fruits.indexOf(item);
      if (index < 0) {
        return fruits;
      }

      fruits.splice(index, 1);
      this.announcer.announce(`Removed ${item.name}`);
      return [...fruits];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.items.update(x => [...x, event.option.value]);
    this.currentItem.set('');
    event.option.deselect();
  }


}