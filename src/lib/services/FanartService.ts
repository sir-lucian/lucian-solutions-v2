import { MediaType, type Art, type FanartItem, type Media } from "$lib";

export async function fetchFanarts() {
    const listPostsJSON = "/api/fanarts/list.json";
    try {
        const response = await fetch(listPostsJSON);
        if (!response.ok) {
            throw new Error(`Failed to fetch posts. Status: ${response.status}`);
        }
        const posts: FanartItem[] = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}

export function transformArtToMedia(art: Art, artistName: string): Media {
    const tempMedia: Media = {
        type: MediaType.Image,
        imgSrc: art.filePath,
        altText: `${artistName} - ${art.filePath.split('/').pop() || 'Fanart Image'}`,
        imgLazyLoad: true
    };
    return tempMedia;
}