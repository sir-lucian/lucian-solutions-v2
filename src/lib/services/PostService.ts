import type { PostItem } from "$lib";

export async function fetchPosts() {
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
            throw new Error(`Failed to fetch posts. Status: ${response.status}`);
        }
        const data = await response.json();
        return data as PostItem[];
    } catch (error) {
        console.error('Error fetching posts:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}