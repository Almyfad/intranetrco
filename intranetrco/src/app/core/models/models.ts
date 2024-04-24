interface Centre {
    id: number;
    nom: string;
}

interface TypeConference {
    id: number;
    nom: string;
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
            "nom": "Conférences de renouvellement"
        },
        {
            "id": 2,
            "nom": "Conférences jeunesse"
        },
        {
            "id": 3,
            "nom": "Séminaires"
        }
        ,
        {
            "id": 4,
            "nom": "Convent"
        }
        ,
        {
            "id": 5,
            "nom": "Stage"
        }
        ,
        {
            "id": 5,
            "nom": "Atelier"
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

    static inscriptions: Inscription[] = [
        {
            "id": 1,
            "conference": this.conferences[0]
        },
        {
            "id": 2,
            "conference": this.conferences[1]
        },
        {
            "id": 3,
            "conference": this.conferences[4]
        }

    ];

}





export { Centre, Conference, Inscription, DBMocked ,TypeConference};