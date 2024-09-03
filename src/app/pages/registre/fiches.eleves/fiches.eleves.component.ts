import { Component, inject } from '@angular/core';
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
import { Centre, TypeMembre } from '../../../core/osmose-api-client';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, map, merge, of, switchMap } from 'rxjs';
import { DetailEleveComponent } from "../../../components/detail-eleve/detail-eleve.component";

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



  items = merge(of(null), this.searchForm.valueChanges)
    .pipe(
      debounceTime(500),
      switchMap((form) => this.RegistreService.apiRegistreMembresPost({
        nom: form?.nom,
        prenom: form?.prenom,
        email: form?.email,
        l_aspects: form?.aspects?.map((x) => x.code!),
        l_centres: form?.centres?.map((x) => x.libelle!),
      }))
    )

  itemsCount = this.items.pipe(map((x) => x?.length ?? 0))

  aspectKeySelector = (x: TypeMembre | undefined): string => x?.code ?? ''
  aspectDisplayWith = (x: TypeMembre | undefined): string => x?.description ?? ''

  centreKeySelector = (x: Centre | undefined): string => x?.code ?? ''
  centreDisplayWith = (x: Centre | undefined): string => x?.libelle ?? ''



}
