import { render } from 'svelte/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ url: new URL('https://lucian.solutions/posts') }));

vi.mock('$app/state', () => ({ page: state }));
vi.mock('$app/env/public', () => ({ PUBLIC_FILE_SERVER_URL: 'https://files.lucian.solutions' }));

import Posts from './posts/+page.svelte';
import Fanarts from './fanarts/+page.svelte';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Donate from './donate/+page.svelte';

const post = {
	id: 'example',
	title: 'Example post',
	slug: 'example',
	tags: [],
	htmlItems: [{ type: 'media', medias: [{ type: 'image', src: '/files/posts/example.png' }] }]
};

function expectImage(head: string, url: string) {
	expect(head).toContain(`property="og:image" content="${url}"`);
	expect(head).toContain(`property="twitter:image" content="${url}"`);
}

describe('server-rendered social metadata', () => {
	beforeEach(() => {
		state.url = new URL('https://lucian.solutions/posts');
	});

	it('uses an absolute default image on the posts and fanarts pages', () => {
		expectImage(
			render(Posts, { props: { data: { posts: [] } } }).head,
			'https://lucian.solutions/assets/ls-seo.jpg'
		);
		state.url = new URL('https://lucian.solutions/fanarts');
		expectImage(
			render(Fanarts, { props: { data: { fanarts: [] } } }).head,
			'https://lucian.solutions/assets/ls-seo.jpg'
		);
	});

	it('renders a selected post title and file server image before hydration', () => {
		state.url.searchParams.set('s', post.id);
		const { head } = render(Posts, { props: { data: { posts: [post], post } } });
		expect(head).toContain('property="og:title" content="Example post"');
		expectImage(head, 'https://files.lucian.solutions/files/posts/example.png');
	});

	it('uses the default image for a selected post without images', () => {
		state.url.searchParams.set('s', post.id);
		const noImage = { ...post, htmlItems: [] };
		const { head } = render(Posts, { props: { data: { posts: [noImage], post: noImage } } });
		expect(head).toContain('property="og:title" content="Example post"');
		expectImage(head, 'https://lucian.solutions/assets/ls-seo.jpg');
	});
});
