<script lang="ts">
	import './layout.css';
	import MenuBar from '$lib/components/MenuBar.svelte';
	import GoToTop from '$lib/components/GoToTop.svelte';
	import { page } from '$app/state';

	let { children } = $props();
</script>

{#if !page.error}
	<MenuBar />
{/if}

<div class={page.url.pathname !== '/' && !page.error ? 'pt-16' : ''}>
	{@render children()}
</div>

<GoToTop />