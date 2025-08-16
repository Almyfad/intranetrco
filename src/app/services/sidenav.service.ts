import { Injectable, ViewContainerRef, ComponentRef, Type, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings } from '../config';
import { CoreService } from './core.service';

@Injectable({
    providedIn: 'root'
})
export class SidenavService {
    private isOpenSubject = new BehaviorSubject<boolean>(false);
    private currentComponentSubject = new BehaviorSubject<Type<any> | null>(null);
    private componentRefSubject = new BehaviorSubject<ComponentRef<any> | null>(null);
    private viewContainerRef?: ViewContainerRef;
    private optionsChangeSubject = new BehaviorSubject<AppSettings | null>(null);
    title = signal<string>('Settings');
    width = signal<string>('300px');
    // Observables publics
    public isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
    public currentComponent$: Observable<Type<any> | null> = this.currentComponentSubject.asObservable();
    public optionsChange$: Observable<AppSettings | null> = this.optionsChangeSubject.asObservable();

    constructor(private coreService: CoreService) { }

    /**
     * Définit le ViewContainerRef pour le rendu dynamique des composants
     */
    setViewContainerRef(viewContainer: ViewContainerRef): SidenavService {
        this.viewContainerRef = viewContainer;
        return this;
    }

    /**
     * Ouvre la sidenav
     */
    open(): void {
        this.isOpenSubject.next(true);
    }

    /**
     * Ferme la sidenav
     */
    close(): void {
        this.isOpenSubject.next(false);
    }

    /**
     * Toggle l'état de la sidenav
     */
    toggle(): void {
        this.isOpenSubject.next(!this.isOpenSubject.value);
    }

    /**
     * Vérifie si la sidenav est ouverte
     */
    isOpen(): boolean {
        return this.isOpenSubject.value;
    }
    setTitle(title: string): SidenavService {
        this.title.set(title);
        return this;
    }

    setWidth(width: string): SidenavService {
        this.width.set(width);
        return this;
    }

    /**
     * Change le composant affiché dans la sidenav
     * @param componentType Le type de composant à afficher
     * @param inputs Optionnel: les inputs à passer au composant
     */
    setComponent<T>(componentType: Type<T>, inputs?: Partial<T>): SidenavService {
        if (!this.viewContainerRef) {
            console.error('ViewContainerRef non défini. Appelez setViewContainerRef() d\'abord.');
            return this;
        }

        // Nettoie le composant précédent
        this.clearComponent();

        // Crée le nouveau composant
        const componentRef = this.viewContainerRef.createComponent<T>(componentType);

        // Applique les inputs si fournis
        if (inputs) {
            Object.assign(componentRef.instance as object, inputs);
        }

        // Écoute les changements d'options si le composant a un EventEmitter optionsChange
        if ((componentRef.instance as any).optionsChange) {
            (componentRef.instance as any).optionsChange.subscribe((options: AppSettings) => {
                this.handleOptionsChange(options);
            });
        }

        this.componentRefSubject.next(componentRef);
        this.currentComponentSubject.next(componentType);

        return this;
    }

    /**
     * Nettoie le composant actuel
     */
    clearComponent(): void {
        const currentComponentRef = this.componentRefSubject.value;
        if (currentComponentRef) {
            currentComponentRef.destroy();
            this.componentRefSubject.next(null);
            this.currentComponentSubject.next(null);
        }

        if (this.viewContainerRef) {
            this.viewContainerRef.clear();
        }
    }

    /**
     * Obtient le composant actuellement affiché
     */
    getCurrentComponent(): Type<any> | null {
        return this.currentComponentSubject.value;
    }

    /**
     * Obtient la référence du composant actuellement affiché
     */
    getCurrentComponentRef(): ComponentRef<any> | null {
        return this.componentRefSubject.value;
    }

    /**
     * Gère les changements d'options émis par les composants
     */
    private handleOptionsChange(options: AppSettings): void {
        this.optionsChangeSubject.next(options);
    }

    /**
     * Permet d'émettre manuellement des changements d'options
     */
    emitOptionsChange(options: AppSettings): void {
        this.optionsChangeSubject.next(options);
    }

    /**
     * Nettoie le service lors de la destruction
     */
    destroy(): void {
        this.clearComponent();
        this.isOpenSubject.complete();
        this.currentComponentSubject.complete();
        this.componentRefSubject.complete();
        this.optionsChangeSubject.complete();
    }
}
