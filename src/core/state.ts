import { AppState, User, Election } from '../types';
import { ELECTIONS_BASE } from '../data/elections';

export const state: AppState = {
    view: 'login',
    user: null,
    elections: JSON.parse(JSON.stringify(ELECTIONS_BASE)),
    selectedElection: null,
    votes: {
        first: null,
        second: null
    },
    pinInput: '',
    error: null,
    isLoading: false,
    loadingMessage: '',
    nfcActive: false,
    menuOpen: false
};

export function setState(newState: Partial<AppState>) {
    Object.assign(state, newState);
    // Trigger a re-render signal. In a real app, this might be an event emitter or a store subscription.
    window.dispatchEvent(new CustomEvent('statechange'));
}
