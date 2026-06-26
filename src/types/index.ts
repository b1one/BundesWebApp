export type ElectionType = 'parliament' | 'referendum';
export type ElectionStatus = 'open' | 'closed' | 'voted';

export interface Candidate {
    id: string;
    name: string;
    party: string;
    desc: string;
}

export interface Party {
    id: string;
    name: string;
    desc: string;
}

export interface Option {
    id: string;
    name: string;
    desc: string;
}

export interface Election {
    id: string;
    title: string;
    type: ElectionType;
    status: ElectionStatus;
    info?: string;
    question?: string;
    candidates?: Candidate[];
    parties?: Party[];
    options?: Option[];
}

export interface User {
    name: string;
    id: string;
    verified: boolean;
}

export interface AppState {
    view: string;
    user: User | null;
    elections: Election[];
    selectedElection: Election | null;
    votes: {
        first: string | null;
        second: string | null;
    };
    pinInput: string;
    error: string | null;
    isLoading: boolean;
    loadingMessage: string;
    nfcActive: boolean;
    menuOpen: boolean;
}
