import { Component, inject, Input, model, OnInit } from '@angular/core';
import { MembreOutput } from '../../core/osmose-api-client';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from '../../core/services/snackbar.service';
import { of } from 'rxjs';
@Component({
  selector: 'app-detail-eleve-edit',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './detail-eleve-edit.component.html',
  styleUrl: './detail-eleve-edit.component.scss'
})
export class DetailEleveEditComponent implements OnInit {

 eleve= model<MembreOutput | null>(null);



  private readonly snackBar = inject(SnackbarService);

  editForm: FormGroup | null = null;

  ngOnInit() {
    console.log('eleve', this.eleve);
    this.editForm = new FormGroup({
      nom: new FormControl(this.eleve()?.nom),
      prenom: new FormControl(this.eleve()?.prenom),
      email: new FormControl(this.eleve()?.email),
      datenaissance: new FormControl(''),
      // aspects: new FormControl<TypeMembre[] | null>(null),
      // centres: new FormControl<Centre[] | null>(null),
    });
  }

  save() {
    of(true)
      .subscribe({
        next: _ => {
          this.snackBar.success(`Vos modifications ont été sauvegardées avec succès`);
          this.eleve.set(null)

        }, error: err => {
          this.snackBar.error(err.message)
        }
      });

    console.log(this.editForm!.value);

  }
}
