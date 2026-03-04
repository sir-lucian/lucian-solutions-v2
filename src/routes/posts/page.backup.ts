import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {

    const s = url.searchParams.get('s') || '';
	const res = await fetch('/api/posts/list.json');

	if (!res.ok) {
		return { posts: [] };
	}

	const posts = await res.json();

    const post = posts.find((p: unknown) => (p as { id: string }).id === s);

	return { posts, post };
};
