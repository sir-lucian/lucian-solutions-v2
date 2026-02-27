import type { RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export const GET: RequestHandler = async () => {
    const url = env.PUBLIC_FILE_SERVER_URL;
    try {
        const response = await fetch(`${url}/files/etc/list_posts.json`);
        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch posts.' }), { status: response.status });
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Server error', details: String(error) }), { status: 503 });
    }
};
