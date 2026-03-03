<script lang="ts">
	import './layout.css';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import GoToTop from '$lib/components/GoToTop.svelte';
	import { page } from '$app/state';
	import { navigating } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { pageLoading } from '$lib/stores/pageLoading';
	import LoadingBadge from '$lib/components/LoadingBadge.svelte';
	import { assets } from '$app/paths';

	let { children } = $props();

	afterNavigate(() => {
		pageLoading.stop();
	});

</script>

<svelte:head>
	<link rel="icon" type="image/png" href="{assets}/assets/ls-logo.jpg" sizes="192x192 512x512" />
	<link rel="shortcut icon" href="{assets}/assets/ls-logo.jpg" />
	<link rel="apple-touch-icon" href="{assets}/assets/ls-logo.jpg" sizes="192x192" />
	<link rel="manifest" href="{assets}/manifest.webmanifest" />
	<meta name="theme-color" content="#f8f9fa" />
</svelte:head>

{#if !page.error}
	<MenuBar />
{/if}

<div class={page.url.pathname !== '/' && !page.error ? 'pt-16' : ''}>
	{@render children()}
</div>

<GoToTop />
<LoadingBadge isLoading={$navigating != null || $pageLoading} />