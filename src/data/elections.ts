export const ELECTIONS_BASE = [
    {
        id: 'bt-2025',
        title: 'Bundestagswahl 2025',
        type: 'parliament',
        status: 'open',
        info: 'Wahl zum 21. Deutschen Bundestag',
        candidates: [
            { id: 'c1', name: 'Dr. Anna Schmidt', party: 'Demokratische Union', desc: 'Direktkandidatin Wahlkreis 042' },
            { id: 'c2', name: 'Markus Weber', party: 'Soziale Zukunft', desc: 'Direktkandidat Wahlkreis 042' }
        ],
        parties: [
            { id: 'p1', name: 'Demokratische Union (DU)', desc: 'Konservativ-Liberal' },
            { id: 'p2', name: 'Soziale Zukunft (SZ)', desc: 'Sozialdemokratisch' },
            { id: 'p3', name: 'Grüne Innovation (GI)', desc: 'Ökologisch-Progressiv' }
        ]
    },
    {
        id: 've-mobil',
        title: 'Volksentscheid: Mobilität',
        type: 'referendum',
        status: 'open',
        question: 'Soll der Ausbau des öffentlichen Nahverkehrs (ÖPNV) vorrangig vor dem Straßenbau gefördert werden?',
        options: [
            { id: 'ja', name: 'JA', desc: 'Zustimmung zum Gesetzesentwurf' },
            { id: 'nein', name: 'NEIN', desc: 'Ablehnung des Gesetzesentwurf' }
        ]
    }
];

export const CONSTANTS = {
    CORRECT_PIN: '123456',
    API_DELAY: 1500,
    NFC_SCAN_TIME: 3000
};
