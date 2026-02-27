import { env } from '$env/dynamic/public';
// const FILE_SERVER_URL = env.FILE_SERVER_URL;
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {

    const fileUrl = `${env.PUBLIC_FILE_SERVER_URL}/files/etc/list_posts.json`;
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            return new Response(JSON.stringify({
                message: `Failed to fetch file. Status: ${response.status}`
            }), { status: response.status });
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({
            message: `Error fetching file: ${error instanceof Error ? error.message : String(error)}`
        }), { status: 500 });
    }
}

export const fallback: RequestHandler = async ({ request }) => {
    return new Response(JSON.stringify({
        message: `Method ${request.method} not allowed.`
    }), { status: 405 });
};