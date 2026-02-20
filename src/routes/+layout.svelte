<script lang="ts">
	import './layout.css';
	import favicon from '/assets/favicon.ico';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if !page.error}
	<MenuBar />
{/if}

<div class={page.url.pathname !== '/' && !page.error ? 'pt-16' : ''}>
	{@render children()}
</div>