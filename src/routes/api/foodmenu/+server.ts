import { Randomiser, type FoodMenuData } from '$lib/services/Randomiser';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch }) => {
	try {
        const fetchUrl = 'https://api.lucian.solutions/json/foodmenu.json';
		const response = await fetch(fetchUrl);
		if (!response.ok) {
			throw new Error('Failed to fetch food menu data');
		}
		const data: FoodMenuData = await response.json();

		let category = 0;
		let halal = false;

		const args1 = url.searchParams.get('args1');
		const fullarg = url.searchParams.get('fullarg');

		// Helper to interpret arguments
		const processArg = (arg: string | null) => {
			if (!arg) return;
			// PHP script only checks fullarg to explode, and args1/args2.
			// But the PHP Food logic provided earlier only checked args1 and did nothing with it?
			// Let's re-read the PHP provided in context if available.
			// The PHP snippet for foodmenu was:
			// if (isset($_GET['args1'])) { $args[1] = $_GET['args1'] ?? NULL; }
			// It implies the logic existed but maybe wasn't fully shown or used standard defaults?
			// Wait, the PHP code provided for foodmenu earlier ends with:
			// if (isset($_GET['args1'])) { $args[1] = $_GET['args1'] ?? NULL; }
			// And then it was cut off.
			// I will implement a standard logic:
			// 1: Rice, 2: Noodles, 3: Soup, 4: Others
			// And maybe 'halal' keyword?
            
            // Checking logic from similar PHP scripts usually:
            if (arg.toLowerCase() === 'rice') category = 1;
            else if (arg.toLowerCase() === 'noodles') category = 2;
            else if (arg.toLowerCase() === 'soup') category = 3;
            else if (arg.toLowerCase() === 'others') category = 4;
            else if (arg.toLowerCase() === 'halal') halal = true;
		};
        
        // Based on typical usage:
        if (fullarg) {
            const parts = decodeURIComponent(fullarg).split(' ');
            parts.forEach(p => processArg(p));
        }
        processArg(args1);

		if (category === 0) {
			category = Math.floor(Math.random() * 4) + 1;
		}

		const result = Randomiser.getFoodMenu(data, category, halal);

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
