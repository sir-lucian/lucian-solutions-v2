<script lang="ts">
	let { children, class: className = '', ...rest } = $props();

	let containerRef: HTMLDivElement | undefined = $state();
	let x = $state(0);
	let y = $state(0);
	let isHovering = $state(false);

	function handleMouseMove(e: MouseEvent) {
		if (!containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		x = e.clientX - rect.left;
		y = e.clientY - rect.top;
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
	}

	const commonClasses = `glass-container-black relative overflow-hidden rounded-xl border border-white/10 bg-black/40 text-base-content backdrop-blur-md transition-all duration-300`;
</script>

<div
	bind:this={containerRef}
	class={`${commonClasses} ${className}`}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
    role="presentation"
	{...rest}
>
	<!-- Shine effect container (subtle) -->
	<div
		class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
		class:opacity-100={isHovering}
		style="background: radial-gradient(800px circle at {x}px {y}px, rgba(255,255,255,0.05), transparent 40%);"
	></div>

	<!-- Content wrapper -->
	<div class="relative z-10 w-full h-full">
		{@render children?.()}
	</div>
</div>

<style>
	.glass-container-black {
		box-shadow: 
			0 4px 6px -1px rgba(0, 0, 0, 0.3),
			0 2px 4px -1px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
	}
</style>
