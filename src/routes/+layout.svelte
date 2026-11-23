<script lang="ts">
	import './layout.css';
	import MenuBar from '#lib/components/MenuBar.svelte';
	import GoToTop from '#lib/components/GoToTop.svelte';
	import { navigating, page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { pageLoading } from '#lib/stores/pageLoading.ts';
	import LoadingBadge from '#lib/components/LoadingBadge.svelte';

	let { children } = $props();

	afterNavigate(() => {
		pageLoading.stop();
	});

</script>

<svelte:head>
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#f8f9fa" />
</svelte:head>

{#if !page.error}
	<MenuBar />
{/if}

<div class={page.url.pathname !== '/' && !page.error ? 'pt-16' : ''}>
	{@render children()}
</div>

<GoToTop />
<LoadingBadge isLoading={navigating.to !== null || $pageLoading} />