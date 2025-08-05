interface Centre {
    id: number;
    nom: string;
}
// TODO : DELETE THIS FILE
interface TypeConference {
    id: number;
    nom: string;
    icon : string | undefined;
    color : string | undefined;
}

interface Conference {
    id: number;
    titre: string;
    datedebut: Date;
    datefin: Date;
    centre: Centre;
    type: TypeConference;
}

interface Inscription {
    id: number;
    conference: Conference;
    lit: Lit;
    heureArrivee: HeureArrivee;
    heureDepart: HeureDepart;
    participation: ParticipationTache;
    description:string;
}

interface Lit {
    id: number;
    nom: string;
}

interface HeureArrivee {
    id: number;
    nom: string;
}
interface HeureDepart {
    id: number;
    nom: string;
}
interface ParticipationTache {
    id: number;
    nom: string;
}

class DBMocked {
    static centres: Centre[] = [
        {
            "id": 1,
            "nom": "Mont-Givroux"
        },
        {
            "id": 2,
            "nom": "La Licorne"
        },
        {
            "id": 3,
            "nom": "Arc-Atlantique"
        }
    ];
    static types: TypeConference[] = [
        {
            "id": 1,
            "icon": "event",
            "color": "#caa55c",
            "nom": "Conférences de renouvellement"
        },
        {
            "id": 2,
            "nom": "Conférences jeunesse",
            "icon": "event",
            "color": "#058f93",
        },
        {
            "id": 3,
            "nom": "Séminaires",
            "icon": "event",
            "color": "#295e08",
        }
        ,
        {
            "id": 4,
            "nom": "Convent",
            "icon": "event",
            "color": "#581676",
        }
        ,
        {
            "id": 5,
            "nom": "Stage",
            "icon": "event",
            "color": "#991212",
        }
        ,
        {
            "id": 5,
            "nom": "Atelier",
            "icon": "event",
            "color": "#999312",
        }
    ];
    static conferences: Conference[] = Array.from({ length: 5 }, (_, t) => {
        return this.centres.flatMap(c => {
            let k = t + 1;
            return [{
                "id": 100 + k * 10,
                "titre": "CR " + k + " 2024",
                "datedebut": new Date(2024, k, 1),
                "datefin": new Date(2024, k, 2),
                type: this.types[0],
                "centre": c
            }, {
                "id": 101 + k * 10,
                "titre": "Convent Travailleurs " + k,
                "datedebut": new Date(2024, k, 10),
                "datefin": new Date(2024, k, 11),
                type: this.types[3],
                "centre": c
            }, {
                "id": 103 + k * 10,
                "titre": "CR jeunnesse " + k,
                "datedebut": new Date(2024, k, 13),
                "datefin": new Date(2024, k, 15),
                type: this.types[1],
                "centre": c
            }, {
                "id": 104 + k * 10,
                "titre": "CR Gral CTO " + k,
                "datedebut": new Date(2024, k, 13),
                "datefin": new Date(2024, k, 15),
                type: this.types[2],
                "centre": c
            }
            ];
        })
    }).flat()
    static lits: Lit[] = [
        { "id": 1, "nom": "Indifférent" },
        { "id": 2, "nom": "inférieur" },
        { "id": 3, "nom": "supérieur" },
        { "id": 4, "nom": "Pas de lit" }
    ];
    static heureArrivees: HeureArrivee[] = [
        { "id": 1, "nom": "Vendredi soir (Repas + nuit)" },
        { "id": 2, "nom": "Vendredi soir (Nuit)" },
        { "id": 3, "nom": "Samedi matin" },
        { "id": 4, "nom": "Samedi soir (Repas + nuit)" },
        { "id": 5, "nom": "Samedi soir (Nuit)" },
        { "id": 6, "nom": "Dimanche matin" },
        { "id": 7, "nom": "Autre (préciser)" }
    ];
    static heureDeparts: HeureDepart[] = [
        { "id": 1, "nom": "Samedi fin CR" },
        { "id": 2, "nom": "Dimanche fin CR" },
        { "id": 3, "nom": "Autre (préciser)" }
    ];
    static participationTaches: ParticipationTache[] = [
        { "id": 1, "nom": "Si besoin" },
        { "id": 2, "nom": "Oui" },
        { "id": 3, "nom": "Non" }
    ];
    static inscriptions: Inscription[] = [
        {
            "id": 1,
            "conference": this.conferences[0],
            "lit": this.lits[0],
            "heureArrivee": this.heureArrivees[3],
            "heureDepart": this.heureDeparts[0],
            "participation": this.participationTaches[0],
            "description" : "Coucou"
        },
        {
            "id": 2,
            "conference": this.conferences[1],
            "lit": this.lits[0],
            "heureArrivee": this.heureArrivees[0],
            "heureDepart": this.heureDeparts[0],
            "participation": this.participationTaches[0],
            "description" : "Coucou"
        },
        {
            "id": 3,
            "conference": this.conferences[4],
            "lit": this.lits[0],
            "heureArrivee": this.heureArrivees[0],
            "heureDepart": this.heureDeparts[0],
            "participation": this.participationTaches[0],
            "description" : "Coucou"
        }]


}

export { Centre, Conference, Inscription, DBMocked, TypeConference, Lit, HeureArrivee, HeureDepart, ParticipationTache };