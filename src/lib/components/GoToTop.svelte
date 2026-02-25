<script lang="ts">
	import { fade } from 'svelte/transition';
	import ButtonGlass from '$lib/components/buttons/ButtonGlass.svelte';

	let y = $state(0);
	let height = $state(0);

	function goToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:window bind:scrollY={y} bind:innerHeight={height} />

{#if y > height}
	<div class="fixed bottom-6 right-6 z-50 lg:hidden" transition:fade={{ duration: 200 }}>
		<ButtonGlass onclick={goToTop} class="btn-circle shadow-lg" aria-label="Go to top">
			<i class="fas fa-arrow-up"></i>
		</ButtonGlass>
	</div>
{/if}
