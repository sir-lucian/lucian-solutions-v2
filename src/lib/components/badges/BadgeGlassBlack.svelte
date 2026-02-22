<script lang="ts">
	let { children, class: className = '', ...rest } = $props();

	let badgeRef: HTMLSpanElement | undefined = $state();
	let x = $state(0);
	let y = $state(0);
	let isHovering = $state(false);

	function handleMouseMove(e: MouseEvent) {
		if (!badgeRef) return;
		const rect = badgeRef.getBoundingClientRect();
		x = e.clientX - rect.left;
		y = e.clientY - rect.top;
		isHovering = true;
	}

	function handleMouseLeave() {
		isHovering = false;
	}

	const commonClasses = `glass-badge-black relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-medium text-white shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/60 hover:shadow-lg`;
</script>

<span
	bind:this={badgeRef}
	class={`${commonClasses} ${className}`}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
    role="status"
	{...rest}
>
	<!-- Shine effect container (subtler for black glass) -->
	<div
		class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
		class:opacity-100={isHovering}
		style="background: radial-gradient(300px circle at {x}px {y}px, rgba(255,255,255,0.15), transparent 40%);"
	></div>

	<!-- Content wrapper -->
	<span class="relative z-10 flex items-center gap-1">
		{@render children?.()}
	</span>
</span>

<style>
	.glass-badge-black {
		box-shadow: 
			0 2px 4px -1px rgba(0, 0, 0, 0.3),
			0 1px 2px -1px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
	}
</style>
