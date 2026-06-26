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
    
    // API Configuration
    private readonly API_BASE_URL = 'https://api.signicat.com/eid-hub/v1';
    // In a production app, these MUST be stored in a secure backend.
    // For the sandbox prototype, we use environment-style placeholders.
    private readonly CLIENT_ID = 'BUNDESWAHLAPP_SANDBOX_ID'; 
    private readonly CLIENT_SECRET = 'BUNDESWAHLAPP_SANDBOX_SECRET';

    private constructor() {}

    public static getInstance(): EIDService {
        if (!EIDService.instance) {
            EIDService.instance = new EIDService();
        }
        return EIDService.instance;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.API_BASE_URL}${endpoint}`;
        
        // Signicat requires Basic Auth or Bearer Token
        const authHeader = 'Basic ' + btoa(`${this.CLIENT_ID}:${this.CLIENT_SECRET}`);
        
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Creates an authentication session for the German Personalausweis.
     */
    public async createSession(): Promise<SignicatSession> {
        console.log('[EIDService] Creating Signicat session for German eID...');
        
        return this.request<SignicatSession>('/sessions', {
            method: 'POST',
            body: JSON.stringify({
                idp: 'DE_EID', // German Personalausweis IDP
                callbackUrl: 'https://bundeswahlapp.de/callback',
                // Additional required fields for Signicat eID Hub go here
            })
        });
    }

    /**
     * Polls the status of the authentication session.
     */
    public async getSessionStatus(sessionId: string): Promise<SignicatSession> {
        console.log(`[EIDService] Checking status for session ${sessionId}...`);
        return this.request<SignicatSession>(`/sessions/${sessionId}`);
    }

    /**
     * Cancels an ongoing authentication session.
     */
    public async cancelSession(sessionId: string): Promise<{ success: boolean }> {
        console.log(`[EIDService] Canceling session ${sessionId}...`);
        return this.request<{ success: boolean }>(`/sessions/${sessionId}`, {
            method: 'DELETE'
        });
    }

    /**
     * signs a payload using the authenticated eID session.
     */
    public async signPayload(payload: any, sessionId: string): Promise<string> {
        console.log('[EIDService] Requesting cryptographic signature from Signicat...');
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
