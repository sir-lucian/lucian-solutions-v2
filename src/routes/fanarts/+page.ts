import type { PageLoad } from './$types';

export const ssr = true;
export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/fanarts/list.json');
		if (!res.ok) {
			return { fanarts: [] };
		}
		const fanarts = await res.json();
		return { fanarts };
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return { fanarts: [] };
	}
};
