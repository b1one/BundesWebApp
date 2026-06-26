import { state, setState } from './state';
import { CONSTANTS } from '../data/elections';
import { Election } from '../types';
import { eidService } from '../api/eid.service';

export const Actions = {
    navigateTo: (view: string) => {
        setState({ view });
    },
    
    toggleMenu: () => {
        setState({ menuOpen: !state.menuOpen });
    },

    startNfc: async () => {
        setState({ isLoading: true, loadingMessage: 'Initialisiere eID-Sitzung...' });
        
        try {
            const session = await eidService.createSession();
            console.log(`[Actions] Signicat Session created: ${session.id}`);
            
            setState({ 
                isLoading: false, 
                nfcActive: true,
                loadingMessage: `Sitzung ${session.id} aktiv` 
            });

            Actions.pollSessionStatus(session.id);

        } catch (error: any) {
            setState({ isLoading: false, error: `eID-Fehler: ${error.message}` });
        }
    },

    pollSessionStatus: async (sessionId: string) => {
        const POLL_INTERVAL = 3000;
        const MAX_ATTEMPTS = 20; 
        let attempts = 0;

        const check = async () => {
            if (!state.nfcActive) return;

            try {
                const session = await eidService.getSessionStatus(sessionId);
                console.log(`[Actions] Session status: ${session.status}`);

                if (session.status === 'COMPLETED') {
                    setState({ 
                        nfcActive: false, 
                        isLoading: true, 
                        loadingMessage: 'Verifiziere Identität...' 
                    });
                    
                    setTimeout(() => {
                        setState({ 
                            isLoading: false, 
                            view: 'pin_entry',
                            user: session.user || { name: 'Max Mustermann', id: 'L029384', verified: true }
                        });
                    }, 1000);
                    return;
                }

                if (session.status === 'CANCELED' || session.status === 'EXPIRED') {
                    setState({ 
                        nfcActive: false, 
                        error: 'Die Authentifizierung wurde abgebrochen oder ist abgelaufen.' 
                    });
                    return;
                }

                attempts++;
                if (attempts >= MAX_ATTEMPTS) {
                    setState({ 
                        nfcActive: false, 
                        error: 'Zeitüberschreitung: Bitte versuchen Sie es erneut.' 
                    });
                    return;
                }

                setTimeout(check, POLL_INTERVAL);
            } catch (error: any) {
                console.error('[Actions] Polling error:', error);
                setTimeout(check, POLL_INTERVAL);
            }
        };

        check();
    },

    cancelNfc: () => {
        setState({ nfcActive: false });
    },

    nfcScanSuccess: async () => {
        setState({ nfcActive: false, isLoading: true, loadingMessage: 'Verifiziere Identität...' });
        
        try {
            // Simulate receiving a token from the AusweisApp
            const mockToken = 'eid_token_secure_12345';
            const result = await eidService.verifyToken(mockToken);
            
            if (result.success && result.user) {
                setState({ isLoading: false, view: 'pin_entry' });
                // Store the verified user temporarily in state
                setState({ user: result.user });
            } else {
                setState({ isLoading: false, error: result.error || 'Identitätsprüfung fehlgeschlagen.' });
            }
        } catch (error) {
            setState({ isLoading: false, error: 'Ein kritischer Fehler ist aufgetreten.' });
        }
    },

    pinInput: (val: string) => {
        let currentPin = state.pinInput;
        if (val === 'del') {
            currentPin = currentPin.slice(0, -1);
        } else if (currentPin.length < 6) {
            currentPin += val;
        }
        setState({ pinInput: currentPin, error: null });
    },

    submitPin: async () => {
        setState({ isLoading: true, loadingMessage: 'Prüfe PIN...' });

        return new Promise((resolve) => {
            setTimeout(() => {
                setState({ isLoading: false });
                if (state.pinInput === CONSTANTS.CORRECT_PIN) {
                    setState({ 
                        view: 'dashboard',
                        pinInput: ''
                    });
                } else {
                    setState({ 
                        error: 'Falsche PIN. (Hinweis: 123456)', 
                        pinInput: '', 
                        view: 'pin_entry' 
                    });
                }
                resolve(true);
            }, 1000);
        });
    },

    selectElection: (election: Election) => {
        setState({ 
            selectedElection: election, 
            votes: { first: null, second: null }, 
            view: 'voting' 
        });
    },

    vote: (type: 'first' | 'second', id: string) => {
        setState({ 
            votes: { ...state.votes, [type]: id } 
        });
    },

    isVoteComplete: () => {
        const e = state.selectedElection;
        if (!e) return false;
        if (e.type === 'parliament') {
            return !!(state.votes.first && state.votes.second);
        }
        return !!state.votes.first;
    },

    goToReview: () => {
        setState({ view: 'confirmation' });
    },

    getLabel: (id: string) => {
        const e = state.selectedElection;
        if (!e) return id;
        const found = e.candidates?.find(c => c.id === id) || 
                     e.parties?.find(p => p.id === id) || 
                     e.options?.find(o => o.id === id);
        return found ? found.name : id;
    },

    submitVote: async () => {
        setState({ isLoading: true, loadingMessage: 'Signiere mit eID...' });

        try {
            const payload = {
                electionId: state.selectedElection?.id,
                votes: state.votes,
                userId: state.user?.id
            };
            
            // Real cryptographic signing using the eID service
            const signature = await eidService.signPayload(payload);
            console.log(`[Actions] Vote signed securely: ${signature}`);

            setTimeout(() => {
                const currentElectionId = state.selectedElection?.id;
                const updatedElections = state.elections.map(e => {
                    if (e.id === currentElectionId) {
                        return { ...e, status: 'voted' as const };
                    }
                    return e;
                });

                setState({
                    isLoading: false,
                    view: 'success',
                    elections: updatedElections
                });
            }, 1500);
        } catch (error) {
            setState({ isLoading: false, error: 'Fehler beim Signieren der Stimme.' });
        }
    },

    logout: () => {
        setState({ 
            user: null, 
            menuOpen: false, 
            view: 'login' 
        });
    }
};
