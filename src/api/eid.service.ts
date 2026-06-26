import { User } from '../types';

export interface EIDAuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
}

export interface SignicatSession {
    id: string;
    status: 'CREATED' | 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'CANCELED';
    url?: string;
    user?: User;
}

export class EIDService {
    private static instance: EIDService;
    
    // Change: Now calling our own serverless proxy
    private readonly API_PROXY_URL = '/api/eid';

    private constructor() {}

    public static getInstance(): EIDService {
        if (!EIDService.instance) {
            EIDService.instance = new EIDService();
        }
        return EIDService.instance;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Construct URL to call the Vercel function
        const url = `${this.API_PROXY_URL}${endpoint}`;
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Proxy Error: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Creates an authentication session for the German Personalausweis.
     */
    public async createSession(): Promise<SignicatSession> {
        console.log('[EIDService] Creating Signicat session via proxy...');
        
        return this.request<SignicatSession>('/sessions', {
            method: 'POST',
            body: JSON.stringify({
                idp: 'DE_EID',
                callbackUrl: 'https://bundeswahlapp.vercel.app/callback',
            })
        });
    }

    /**
     * Polls the status of the authentication session.
     */
    public async getSessionStatus(sessionId: string): Promise<SignicatSession> {
        console.log(`[EIDService] Checking status via proxy for session ${sessionId}...`);
        return this.request<SignicatSession>(`/sessions/${sessionId}`);
    }

    /**
     * Cancels an ongoing authentication session.
     */
    public async cancelSession(sessionId: string): Promise<{ success: boolean }> {
        console.log(`[EIDService] Canceling session via proxy ${sessionId}...`);
        return this.request<{ success: boolean }>(`/sessions/${sessionId}`, {
            method: 'DELETE'
        });
    }

    /**
     * signs a payload using the authenticated eID session.
     */
    public async signPayload(payload: any, sessionId: string): Promise<string> {
        console.log('[EIDService] Requesting signature via proxy...');
        const response = await this.request<{ signature: string }>('/sign', {
            method: 'POST',
            body: JSON.stringify({
                sessionId,
                payload
            })
        });
        return response.signature;
    }
}

export const eidService = EIDService.getInstance();
