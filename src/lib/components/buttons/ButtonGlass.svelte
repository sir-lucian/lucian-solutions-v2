<script lang="ts">
	import { onMount } from 'svelte';

	let { 
		children, 
		class: className = '',
		href = undefined,
		openNewWindow = false,
		...rest 
	} = $props();

	let btnRef: Element | undefined = $state();
	let x = $state(0);
	let y = $state(0);
	let isHovering = $state(false);

	function handleMouseMove(e: MouseEvent) {
		if (!btnRef) return;
		const rect = (btnRef as Element).getBoundingClientRect();
		// @ts-ignore
		x = e.clientX - rect.left;
		// @ts-ignore
		y = e.clientY - rect.top;
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
	}

	const commonClasses = `glass-btn relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-xl active:scale-95 hover:cursor-pointer`;
</script>

{#if href}
	<a
		bind:this={btnRef}
		{href}
		target={openNewWindow ? '_blank' : undefined}
		rel={openNewWindow ? 'noopener noreferrer' : undefined}
		class={`${commonClasses} ${className}`}
		onmousemove={handleMouseMove}
		onmouseleave={handleMouseLeave}
		{...rest}
	>
		<!-- Shine effect container -->
		<div
			class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
			class:opacity-100={isHovering}
			style="background: radial-gradient(600px circle at {x}px {y}px, rgba(255,255,255,0.4), transparent 40%);"
		></div>
		
		<!-- Content wrapper -->
		<span class="relative z-10 flex items-center gap-2">
			{@render children?.()}
		</span>
	</a>
{:else}
	<button
		bind:this={btnRef}
		class={`${commonClasses} ${className}`}
		onmousemove={handleMouseMove}
		onmouseleave={handleMouseLeave}
		{...rest}
	>
		<!-- Shine effect container -->
		<div
			class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
			class:opacity-100={isHovering}
			style="background: radial-gradient(600px circle at {x}px {y}px, rgba(255,255,255,0.4), transparent 40%);"
		></div>
		
		<!-- Content wrapper -->
		<span class="relative z-10 flex items-center gap-2">
			{@render children?.()}
		</span>
	</button>
{/if}

<style>
	/* Optional: Add extra glass depth */
	.glass-btn {
		box-shadow: 
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
	}
</style>
