<script lang="ts">
	import { onMount } from 'svelte';

	let { 
		children, 
		class: className = '',
		href = undefined,
		openNewWindow = false,
		title = '',
		...rest 
	} = $props();

	let btnRef: Element | undefined = $state();
	let x = $state(0);
	let y = $state(0);
	let isHovering = $state(false);
	let rect = $state<DOMRect | undefined>();

	function handleMouseMove(e: MouseEvent) {
		if (!btnRef) return;
		rect = (btnRef as Element).getBoundingClientRect();
		x = e.clientX - rect.left;
		y = e.clientY - rect.top;
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
	}

	let boxStyle = $derived.by(() => {
		if (!isHovering || !rect) return '';
		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		const deltaX = (x - centerX) / centerX; 
		const deltaY = (y - centerY) / centerY; 

		const maxOffset = 1;

		const rX = deltaX * maxOffset;
		const rY = deltaY * maxOffset;

		const bX = -deltaX * maxOffset;
		const bY = -deltaY * maxOffset;

		return `box-shadow: 
			${rX}px ${rY}px 4px rgba(255, 0, 0, 0.4), 
			${bX}px ${bY}px 4px rgba(0, 255, 255, 0.4),
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.1);`;
	});

	const commonClasses = `glass-btn relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:cursor-pointer`;
</script>

{#if href}
	<a
		bind:this={btnRef}
		{href}
		title={title}
		target={openNewWindow ? '_blank' : undefined}
		rel={openNewWindow ? 'noopener noreferrer' : undefined}
		class={`${commonClasses} ${className}`}
		style={boxStyle}
		onmousemove={handleMouseMove}
		onmouseleave={handleMouseLeave}
		{...rest}
	>
		<div
			class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
			class:opacity-100={isHovering}
			style="background: radial-gradient(600px circle at {x}px {y}px, rgba(255,255,255,0.2), transparent 40%);"
		></div>
		
		<span class="relative z-10 flex items-center gap-2">
			{@render children?.()}
		</span>
	</a>
{:else}
	<button
		bind:this={btnRef}
		class={`${commonClasses} ${className}`}
		style={boxStyle}
		onmousemove={handleMouseMove}
		onmouseleave={handleMouseLeave}
		title={title}
		{...rest}
	>
		<div
			class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
			class:opacity-100={isHovering}
			style="background: radial-gradient(600px circle at {x}px {y}px, rgba(255,255,255,0.2), transparent 40%);"
		></div>
		
		<span class="relative z-10 flex items-center gap-2">
			{@render children?.()}
		</span>
	</button>
{/if}

<style>
	.glass-btn {
		box-shadow: 
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
	}
</style>
