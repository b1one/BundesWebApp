import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE_URL = 'https://api.signicat.com/eid-hub/v1';
const CLIENT_ID = process.env.SIGNICAT_CLIENT_ID || 'sandbox-determined-heart-809';
const CLIENT_SECRET = process.env.SIGNICAT_CLIENT_SECRET || 'ExpzpJ5Vvhj60Cmx47CeD3zTVX4tDdqlLdO2lZ0dcZuWvhfe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).setHeader('Access-Control-Allow-Origin', '*').setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS').setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization').send();
    }

    const { pathname } = new URL(req.url || '', 'https://example.com'); // dummy base for parsing
    // We expect requests to /api/eid/sessions or /api/eid/sign
    // Vercel's file routing handles the path, but we need to map it to Signicat
    
    let endpoint = '';
    if (req.url?.includes('/sessions')) {
        endpoint = '/sessions';
    } else if (req.url?.includes('/sign')) {
        endpoint = '/sign';
    } else {
        return res.status(404).json({ error: 'Endpoint not found' });
    }

    // Extract session ID for specific requests
    let finalUrl = `${API_BASE_URL}${endpoint}`;
    if (req.method === 'GET' || req.method === 'DELETE') {
        const match = req.url?.match(/\/sessions\/([^\/]+)/);
        if (match) {
            finalUrl = `${API_BASE_URL}/sessions/${match[1]}`;
        }
    }

    try {
        const authHeader = 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        
        const response = await fetch(finalUrl, {
            method: req.method,
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
        });

        const data = await response.json();
        
        return res.status(response.status).setHeader('Access-Control-Allow-Origin', '*').json(data);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
