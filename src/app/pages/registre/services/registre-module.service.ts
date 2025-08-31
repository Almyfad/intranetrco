import { inject, Injectable, signal, computed, effect } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { firstValueFrom, map, take } from "rxjs";
import { FamilyDTO, MembreDTO, RegistreService, TimelineMembreDTO } from "src/app/core/helios-api-client";

export interface AsyncDataSource<T> {
    data: T[];
    loading: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class RegistreModuleService {
    readonly registreService = inject(RegistreService);

    constructor() {
        // Effet pour récupérer automatiquement les données de famille
        effect(() => {
            const eleve = this.selectedEleve();
            const reload = this.reload();
            if (eleve?.id) {
                this.loadFamilyData(eleve.id);
                this.loadTimelineData(eleve.id);
            }
        });
    }


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
    civilites = toSignal(
        this.registre.apiRegistreCivilitesGet().pipe(
            map(x => ({ data: x, loading: false })),
            take(1)
        ),
        { initialValue: { data: [], loading: true } }
    );

    timelineEventTypes = toSignal(
        this.registre.apiRegistreTimelineTypesGet().pipe(
            map(x => ({ data: x, loading: false })),
            take(1)
        ),
        { initialValue: { data: [], loading: true } }
    );

    // Signaux privés
    private selectedEleve = signal<MembreDTO | null>(null);
    private familyData = signal<FamilyDTO | null>(null);
    private isfamilyLoading = signal<boolean>(false);
    private timelineData = signal<TimelineMembreDTO[] | null>(null);
    private reload = signal<number>(0);
    private istimelineLoading = signal<boolean>(false);

    // Signaux publics en lecture seule
    readonly eleve = this.selectedEleve.asReadonly();
    readonly family = this.familyData.asReadonly();
    readonly familyloading = this.isfamilyLoading.asReadonly();
    readonly timeline = this.timelineData.asReadonly();
    readonly timelineLoading = this.istimelineLoading.asReadonly();

    // Signaux calculés pour parents et enfants
    readonly parents = computed(() => {
        return this.familyData()?.parents || [];
    });

    readonly enfants = computed(() => {
        return this.familyData()?.enfants || [];
    });

    // Méthodes publiques
    setEleve(eleve: MembreDTO): void {
        if (!eleve.id) {
            console.warn('Tentative de sélection d\'un élève sans ID:', eleve);
            return;
        }
        this.selectedEleve.set(eleve);
    }

    clearEleve(): void {
        this.selectedEleve.set(null);
        this.familyData.set(null);
    }

    // Méthode privée pour charger les données de famille
    private async loadFamilyData(eleveId: number): Promise<void> {
        try {
            this.isfamilyLoading.set(true);

            const familyResponse = await firstValueFrom(this.registreService.apiRegistreMembresIdFamilyGet(eleveId));
            if (familyResponse) {
                this.familyData.set(familyResponse);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données de famille:', error);
            this.familyData.set(null);
        } finally {
            this.isfamilyLoading.set(false);
        }
    }

    private async loadTimelineData(eleveId: number): Promise<void> {
        try {
            this.istimelineLoading.set(true);

            const timelineResponse = await firstValueFrom(this.registreService.apiRegistreMembresIdTimelineGet(eleveId));
            if (timelineResponse) {
                this.timelineData.set(timelineResponse);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des données de timeline:', error);
            this.timelineData.set(null);
        } finally {
            this.istimelineLoading.set(false);
        }
    }
    public reloadAll(): void {
        this.reload.set(Date.now());
    }
}
