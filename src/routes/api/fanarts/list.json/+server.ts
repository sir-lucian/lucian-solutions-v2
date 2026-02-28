import type { RequestHandler } from '@sveltejs/kit';
import { PUBLIC_FILE_SERVER_URL } from '$env/static/public';

export const GET: RequestHandler = async () => {
    const url = PUBLIC_FILE_SERVER_URL;
    try {
        const response = await fetch(`${url}/files/etc/list_fanarts.json`);
        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch fanarts.' }), { status: response.status });
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Server error', details: String(error) }), { status: 503 });
    }
};
