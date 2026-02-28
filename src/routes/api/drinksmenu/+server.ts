import { PUBLIC_FILE_SERVER_URL } from '$env/static/public';
import { Randomiser, type DrinksMenuData } from '$lib/services/Randomiser';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	try {
        const fetchUrl = `${PUBLIC_FILE_SERVER_URL}/files/etc/list_drinksmenu.json`;
		const response = await fetch(fetchUrl);
		if (!response.ok) {
			throw new Error('Failed to fetch drinks menu data');
		}
		const data: DrinksMenuData = await response.json();

		let category = 0;
		let partyMode = 0;

		const args1 = url.searchParams.get('args1');
		const args2 = url.searchParams.get('args2');
		const fullarg = url.searchParams.get('fullarg');

		// Helper to interpret arguments
		const processArg = (arg: string | null) => {
			if (!arg) return;
			switch (arg.toLowerCase()) {
				case 'partymode':
					partyMode = 1;
					break;
				case 'coffee':
					category = 1;
					break;
				case 'tea':
					category = 2;
					break;
				case 'juice':
					category = 3;
					break;
				case 'soda':
					category = 4;
					break;
				case 'alcohol':
					category = 5;
					break;
			}
		};

		if (fullarg) {
			const parts = decodeURIComponent(fullarg).split(' ');
			if (parts[1]) processArg(parts[1]);
			if (parts[2]) processArg(parts[2]);
		}

		processArg(args1);
		processArg(args2);

		if (category === 0) {
			const max = partyMode === 1 ? 5 : 4;
			category = Math.floor(Math.random() * max) + 1;
		}

		const result = Randomiser.getDrinksMenu(data, category);

		return new Response(`<html><body>${result}</body></html>`, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8'
			}
		});
	} catch (error) {
		console.error(error);
		return new Response('เกิดข้อผิดพลาด', {
			status: 500,
			headers: { 'Content-Type': 'text/plain; charset=utf-8' }
		});
	}
};
