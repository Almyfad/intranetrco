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
    id : number;
    conference: Conference;
}

export { Centre, Conference, Inscription };