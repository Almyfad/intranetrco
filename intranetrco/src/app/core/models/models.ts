interface Centre {
    id: number;
    nom: string;
}

interface Conference {
    id: number;
    titre: string;
    date: string;
    centre: Centre;
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
            "nom": "Centre 3"
        }
    ];
    static conferences: Conference[] = [{
        "id": 100,
        "titre": "Conference de renouvellement",
        "date": "2024-01-01",
        "centre": this.centres[0]
    }, {
        "id": 101,
        "titre": "Convent Travailleurs",
        "date": "2024-01-02",
        "centre": this.centres[0]
    }, {
        "id": 103,
        "titre": "Conference CTO",
        "date": "2024-01-03",
        "centre": this.centres[0]
    }, {
        "id": 100,
        "titre": "Conference de renouvellement",
        "date": "2024-02-01",
        "centre": this.centres[1]
    }, {
        "id": 101,
        "titre": "Convent Travailleurs",
        "date": "2024-03-02",
        "centre": this.centres[1]
    }, {
        "id": 103,
        "titre": "Conference CTO",
        "date": "2024-04-03",
        "centre": this.centres[1]
    }
    ];
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




export { Centre, Conference, Inscription, DBMocked };