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

	const commonClasses = `glass-badge relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg`;
</script>

<span
	bind:this={badgeRef}
	class={`${commonClasses} ${className}`}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
    role="status"
	{...rest}
>
	<!-- Shine effect container -->
	<div
		class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
		class:opacity-100={isHovering}
		style="background: radial-gradient(300px circle at {x}px {y}px, rgba(255,255,255,0.4), transparent 40%);"
	></div>

	<!-- Content wrapper -->
	<span class="relative z-10 flex items-center gap-1">
		{@render children?.()}
	</span>
</span>

<style>
	.glass-badge {
		box-shadow: 
			0 2px 4px -1px rgba(0, 0, 0, 0.1),
			0 1px 2px -1px rgba(0, 0, 0, 0.06),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
	}
</style>
