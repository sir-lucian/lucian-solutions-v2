import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Set security headers
	response.headers.set('X-Content-Type-Options', 'nosniff');

	// Keep referrers private by default; YouTube iframes explicitly opt in to origin referrers.
	response.headers.set('Referrer-Policy', 'no-referrer');

	// This is a strong HSTS policy that tells browsers to only use HTTPS for the next year, including all subdomains
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

	// This header prevents the page from being framed, which can help protect against clickjacking attacks.
	response.headers.set('X-Frame-Options','DENY');

	// Remove common headers that disclose server/technology details
	response.headers.delete('server');
	response.headers.delete('x-powered-by');
	response.headers.delete('via');
	return response;
};
