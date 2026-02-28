import { writable } from 'svelte/store';

const MIN_VISIBLE_MS = 180;

const _store = writable(false);
let _visibleSince = 0;
let _timer: ReturnType<typeof setTimeout> | null = null;

export const pageLoading = {
	subscribe: _store.subscribe,
	start() {
		if (_timer) return; // already scheduled/visible
		_visibleSince = Date.now();
		_store.set(true);
	},
	stop() {
		const elapsed = Date.now() - _visibleSince;
		const remaining = MIN_VISIBLE_MS - elapsed;
		if (remaining <= 0) {
			if (_timer) {
				clearTimeout(_timer);
				_timer = null;
			}
			_store.set(false);
			return;
		}
		if (_timer) return;
		_timer = setTimeout(() => {
			_store.set(false);
			_timer = null;
		}, remaining);
	}
};
