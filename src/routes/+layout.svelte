<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import MenuBar from '$lib/components/MenuBar.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<MenuBar />
{@render children()}