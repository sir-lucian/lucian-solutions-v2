import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Set security headers
	response.headers.set('X-Content-Type-Options', 'nosniff');

	// This header prevents the page from being framed, which can help protect against clickjacking attacks. However, it can interfere with embedding content like YouTube videos, so it's commented out for now.
	// This breaks Youtube embeds, so we'll skip it for now. We can revisit this later if needed.
	// response.headers.set('Referrer-Policy', 'no-referrer');

	// This is a strong HSTS policy that tells browsers to only use HTTPS for the next year, including all subdomains
	response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

	// Remove common headers that disclose server/technology details
	response.headers.delete('server');
	response.headers.delete('x-powered-by');
	response.headers.delete('via');
	return response;
};

