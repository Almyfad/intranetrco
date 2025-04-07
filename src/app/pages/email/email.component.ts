import { Component, computed, inject, model, signal, ViewChild } from '@angular/core';
import { CampaignRequest, Centre, CentreCampaignRequest, EmailService, MailingListOutput, RegistreService, TypesMembres } from '../../core/osmose-api-client';
import { AsyncPipe } from '@angular/common';
import { AutocompleteChipsComponent, AutocompleteChipsDataSource, AutocompleteChipsInput, AutocompleteChipsItem } from '../../components/autocomplete-chips/autocomplete-chips.component';
import { MatCardModule } from '@angular/material/card';
import { BehaviorSubject, filter, map, merge, Observable, scan, share, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { EmailEditorComponent, EmailEditorModule } from 'angular-email-editor';
import { MatButtonModule } from '@angular/material/button';
import sample from './sample.json';
import { MatSelectModule } from '@angular/material/select';
import { toObservable } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-email',
  standalone: true,
  imports: [AsyncPipe, MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatSelectModule,
    AutocompleteChipsComponent, EmailEditorModule
  ],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})


export class EmailComponent {
  private readonly mailService = inject(EmailService);
  private readonly registrerService = inject(RegistreService);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    titreCampagne: [null as string | null, Validators.required],
    objet: [null as string | null, Validators.required],
    description: [null as string | null],
    content: [null as string | null, Validators.required],
  });



  selectedCentre = signal<Centre | null>(null);
  listsSelected = signal<MailingListOutput[]>([])

  centres$ = this.registrerService.apiRegistreCentresGet().pipe(
    tap(x => this.selectedCentre.set(x[0])),
    shareReplay(1),
  );
  selectedCentre$ = toObservable(this.selectedCentre).pipe(tap(x => console.log(x)))

  autocompleteChipsOptions: AutocompleteChipsInput<MailingListOutput> = {
    label: 'Liste de diffusion',
    placeholder: 'Sélectionner une ou plusieurs listes de diffusion',
    formControlName: 'listsSelected',
    datasource: new AutocompleteChipsDataSource<MailingListOutput>({
      asyncDataPatern: (pattern: string | null | undefined) => this.centres$.pipe(
        switchMap(x => this.selectedCentre$),
        switchMap((centre) => this.mailService.apiEmailCentreCentreIdListsGet(centre?.id ?? 0)),
        map(x => {
          let i = 0;
          let items = x.filter(x => x.libelle?.toUpperCase().includes(pattern?.toUpperCase() ?? ''));
          items.forEach(element => {
            element.id ??= --i * element.centre!.id!;
          });
          let result: AutocompleteChipsItem<MailingListOutput>[] = items.map(x => ({
            id: x.id!,
            item: x,
            displayWith: x.libelle,
            displayAvatar: x.centre?.code,
          }));
          return result;
        }),
      )
    }),
  }


  groupedLists = computed(() => {
    let groupedList = groupBy(this.listsSelected(), x => x.centre?.code ?? 'undefined')
    delete groupedList['undefined'];
    return groupedList;
  })

  totalRecipient = computed(() => {

    var calls = Object.entries(this.groupedLists())
      .map(([key, value]) => this.mailService.apiEmailCentreCentreIdListsCountPost(
        value[0].centre?.id ?? 0,
        {
          listsIds: value.filter(x => x.listePersonnalisee).map(x => x.id!),
          typesMembres: value.filter(x => !x.listePersonnalisee).map(x => x.typeMembre) as TypesMembres[],
        }))
    return merge(...calls).pipe(
      startWith(0),
      scan((total, n) => total + n))
  });



  @ViewChild('editor')
  private emailEditor: EmailEditorComponent | undefined;

  onSubmit() {
    let now = new Date();
    let date = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Ajoute 2 heures à la date actuelle
    let groupedList = groupBy(this.listsSelected(), x => x.centre?.code ?? 'undefined')
    let CentrecampaignRequest: CentreCampaignRequest[] = Object.keys(groupedList)
      .filter(key => key !== 'undefined')
      .filter(key => groupedList[key][0].centre?.id !== undefined)
      .map(key => {
        return {
          centreId: groupedList[key].filter(x => x.listePersonnalisee)[0].centre!.id!,
          typesMembres: groupedList[key].filter(x => !x.listePersonnalisee).map(x => x.typeMembre) as TypesMembres[],
          listIds: groupedList[key].filter(x => x.listePersonnalisee).map(x => x.id ?? 0)
        };
      })
    this.emailEditor?.editor.exportHtml((data) => {
      let campaignRequest: CampaignRequest = {
        name: this.form.value.titreCampagne ?? '',
        subject: this.form.value.objet ?? '',
        scheduledAt: date.toISOString(),
        sender: {
          email: 'guadeloupe@rose-croix-d-or.org',
          name: 'RCO MAIL TEST',
        },
        htmlContent: data.html,
        centreRequest: CentrecampaignRequest,
      };

      this.mailService.apiEmailCampaignSendPost(campaignRequest).subscribe()
    }
    );
  }


  editorReady($event: Event) {
    console.log('editor ready', $event);
  }
  editorLoaded($event: Event) {
    console.log('editor loaded', $event);
    this.emailEditor?.editor.loadDesign(sample.design);
  }



}

function groupBy<T>(array: T[], key: (item: T) => string): { [key: string]: T[] } {
  return array.reduce((result, item) => {
    const groupKey = key(item);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as { [key: string]: T[] });
}