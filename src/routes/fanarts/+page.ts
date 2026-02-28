import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/fanarts/list.json');
		if (!res.ok) return { fanarts: [] };
		const fanarts = await res.json();
		return { fanarts };
	} catch (e) {
		return { fanarts: [] };
	}
};
