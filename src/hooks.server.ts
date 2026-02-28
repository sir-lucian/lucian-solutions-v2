import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'no-referrer');
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

	// Basic Content Security Policy - adjust as needed for external resources used by the app
	// Stricter Content Security Policy based on external resources used:
	// - allow scripts only from self and YouTube domains (no 'unsafe-inline' or 'unsafe-eval')
	// - allow styles from self and https (kept 'unsafe-inline' for legacy inline styles)
	// - allow images from self, data URIs, and https
	// - allow frames from YouTube domains for embeds
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; img-src 'self' data: https:; script-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; style-src 'self' 'unsafe-inline' https:; frame-src https://www.youtube.com https://www.youtube-nocookie.com; connect-src 'self' https:"
	);

	// Remove common headers that disclose server/technology details
	response.headers.delete('server');
	response.headers.delete('x-powered-by');
	response.headers.delete('via');
	return response;
};

