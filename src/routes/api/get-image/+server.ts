import { env } from '$env/dynamic/public';
// const FILE_SERVER_URL = env.FILE_SERVER_URL;
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {

    const imagePath: string | null = url.searchParams.get('path') ?? null;
    if (!imagePath) {
        return new Response(JSON.stringify({
            message: 'Missing "path" query parameter.'
        }), { status: 400 });
    }
    const fileUrl = `${env.PUBLIC_FILE_SERVER_URL}${decodeURIComponent(imagePath)}`;
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            return new Response(JSON.stringify({
                message: `Failed to fetch file. Status: ${response.status}`
            }), { status: response.status });
        }
        const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
        const blob = await response.blob();
        return new Response(blob, {
            status: 200,
            headers: {
                'Content-Type': contentType
            }
        });
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