import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { map, take } from "rxjs";
import { RegistreService } from "src/app/core/helios-api-client";

export interface AsyncDataSource<T> {
    data: T[];
    loading: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class RegistreModuleService {


    private readonly registre = inject(RegistreService);

    aspects = toSignal(
        this.registre.apiRegistreAspectsGet().pipe(
            map(x => ({ data: x, loading: false })),
            take(1)
        ),
        { initialValue: { data: [], loading: true } }
    );

    centres = toSignal(
        this.registre.apiRegistreCentresGet().pipe(
            map(x => ({ data: x, loading: false })),
            take(1)
        ),
        { initialValue: { data: [], loading: true } }
    );

    statuts = toSignal(
        this.registre.apiRegistreStatutsGet().pipe(
            map(x => ({ data: x, loading: false })),
            take(1)
        ),
        { initialValue: { data: [], loading: true } }
    );
}