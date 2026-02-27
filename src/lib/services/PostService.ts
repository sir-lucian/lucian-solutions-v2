import type { PostItem } from "$lib";

export async function fetchPosts() {
    const listPostsJSON = "/api/posts/list.json";
    try {
        const response = await fetch(listPostsJSON);
        if (!response.ok) {
            throw new Error(`Failed to fetch posts. Status: ${response.status}`);
        }
        const posts: PostItem[] = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}