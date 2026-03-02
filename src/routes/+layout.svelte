<script lang="ts">
	import './layout.css';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import GoToTop from '$lib/components/GoToTop.svelte';
	import { page } from '$app/state';
	import { navigating } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { pageLoading } from '$lib/stores/pageLoading';
	import LoadingBadge from '$lib/components/LoadingBadge.svelte';

	let { children } = $props();

	afterNavigate(() => {
		pageLoading.stop();
	});
	</script>

{#if !page.error}
	<MenuBar />
{/if}

<div class={page.url.pathname !== '/' && !page.error ? 'pt-16' : ''}>
	{@render children()}
</div>

<GoToTop />
<LoadingBadge isLoading={$navigating != null || $pageLoading} />