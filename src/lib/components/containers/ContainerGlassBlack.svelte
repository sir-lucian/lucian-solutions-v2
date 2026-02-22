<script lang="ts">
	let { children, class: className = '', ...rest } = $props();

	let containerRef: HTMLDivElement | undefined = $state();
	let x = $state(0);
	let y = $state(0);
	let isHovering = $state(false);
	let rect = $state<DOMRect | undefined>();

	function handleMouseMove(e: MouseEvent) {
		if (!containerRef) return;
		rect = containerRef.getBoundingClientRect();
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

		const maxOffset = 1.5;

		const rX = deltaX * maxOffset;
		const rY = deltaY * maxOffset;

		const bX = -deltaX * maxOffset;
		const bY = -deltaY * maxOffset;

		return `box-shadow: 
			${rX}px ${rY}px 6px rgba(255, 0, 0, 0.3), 
			${bX}px ${bY}px 6px rgba(0, 255, 255, 0.3),
			0 10px 15px -3px rgba(0, 0, 0, 0.1), 
			0 4px 6px -2px rgba(0, 0, 0, 0.05);`;
	});

	const commonClasses = `glass-container-black relative overflow-hidden rounded-xl border border-white/10 bg-black/40 text-base-content backdrop-blur-md transition-all duration-300`;
</script>

<div
	bind:this={containerRef}
	class={`${commonClasses} ${className}`}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
    role="presentation"
	style={boxStyle}
	{...rest}
>
	<div
		class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
		class:opacity-100={isHovering}
		style="background: radial-gradient(800px circle at {x}px {y}px, rgba(255,255,255,0.05), transparent 40%);"
	></div>

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
