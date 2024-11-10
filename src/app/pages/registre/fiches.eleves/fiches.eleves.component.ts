import { Component, HostListener, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { UserService } from '../../../core/osmose-api-client/api/user.service';
import { RegistreService } from '../../../core/osmose-api-client/api/registre.service';
import { MenuService } from '../../../core/services/menu.service';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteChipsComponent } from '../../../components/autocomplete-chips/autocomplete-chips.component';
import { Centre, MembreOutputDataPager, TypeMembre } from '../../../core/osmose-api-client';
import { FormGroup, FormControl } from '@angular/forms';
import { combineLatest, debounceTime, map, merge, of, scan, shareReplay, switchMap, tap } from 'rxjs';
import { DetailEleveComponent } from "../../../components/detail-eleve/detail-eleve.component";
import { ScrollService } from '../../../core/services/scroll.service';

@Component({
  selector: 'app-fiches.eleves',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, MatExpansionModule, MatFormFieldModule, MatInputModule,
    MatAutocompleteModule, MatChipsModule, MatIconModule, FormsModule, AutocompleteChipsComponent, FormsModule, ReactiveFormsModule, DetailEleveComponent],
  templateUrl: './fiches.eleves.component.html',
  styleUrl: './fiches.eleves.component.scss'
})


export class FichesElevesComponent {

  onAspectChange($event: TypeMembre[]) {
    this.searchForm.patchValue({ aspects: $event.length === 0 ? null : $event })
  }

  onCentreChange($event: Centre[]) {
    this.searchForm.patchValue({ centres: $event.length === 0 ? null : $event })
  }

  delete(arg0: number | undefined) {
    throw new Error('Method not implemented.');
  }
  edit(arg0: number | undefined) {
    throw new Error('Method not implemented.');
  }
  private readonly UserService = inject(UserService)
  private readonly RegistreService = inject(RegistreService)
  private readonly menuService = inject(MenuService);
  private readonly scrollService = inject(ScrollService);
  listing = this.RegistreService.apiRegistreMembresPost()
  aspects = this.RegistreService.apiRegistreAspectsGet()
  centres = this.RegistreService.apiRegistreCentresGet()

  searchForm = new FormGroup({
    nom: new FormControl(''),
    prenom: new FormControl(''),
    aspects: new FormControl<TypeMembre[] | null>(null),
    email: new FormControl(''),
    centres: new FormControl<Centre[] | null>(null),
  });

  currentPage: MembreOutputDataPager = { page: 1, size: 100, data: [] }

  is80Reached$ = this.scrollService.is80Reached$.pipe(tap(x => {
    this.currentPage.page!++
  }))
  searchForm$ = this.searchForm.valueChanges.pipe(tap(x => {
    this.currentPage.page = 1
  }))



  dataPagedItems = combineLatest([
    merge(of(false), this.is80Reached$),
    merge(of(null), this.searchForm$)
  ])
    .pipe(
      debounceTime(500),
      switchMap(([_, form]) => {
        return this.RegistreService.apiRegistreMembresPost(this.currentPage.page, this.currentPage.size, {
          nom: form?.nom,
          prenom: form?.prenom,
          email: form?.email,
          l_aspects: form?.aspects?.map((x) => x.code!),
          l_centres: form?.centres?.map((x) => x.libelle!),
        })
      }),
      tap((x) => {
        if (x.data && (x.page ?? 0) > 1) {
          this.currentPage.data = [...this.currentPage.data!, ...x.data]
        }
        else {
          this.currentPage = x
        }
      }),
      switchMap((_) => of(this.currentPage)),
      shareReplay(1)
    )

  items = this.dataPagedItems.pipe(map((x) => x?.data ?? []))
  itemsCount = this.dataPagedItems.pipe(map((x) => x?.total ?? 0))

  aspectKeySelector = (x: TypeMembre | undefined): string => x?.code ?? ''
  aspectDisplayWith = (x: TypeMembre | undefined): string => x?.description ?? ''

  centreKeySelector = (x: Centre | undefined): string => x?.code ?? ''
  centreDisplayWith = (x: Centre | undefined): string => x?.libelle ?? ''

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollPosition === scrollHeight) {
      console.log('Scrolled to bottom!');
      // Ajoutez ici la logique à exécuter lors du scroll down
    }
  }


}
