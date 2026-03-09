<script lang="ts">
	/* eslint-disable svelte/require-each-key */
	/* eslint-disable @typescript-eslint/no-unused-vars */
	import { onMount, tick } from 'svelte';
	import Lightbox from './Lightbox.svelte';
	import { env } from '$env/dynamic/public';
	import ButtonGlassBlack from './buttons/ButtonGlassBlack.svelte';

	let { className = '', media = [], allPostMedia = [] } = $props();
    const selfUniqueId: string = Math.random().toString(36).substr(2, 9); // Unique ID for this instance if needed

	let scrollContainer: HTMLDivElement | undefined = $state(undefined);
	let itemWidth = 0; // Will be calculated

	let isDown = $state(false);
	let startX = 0;
	let scrollLeft = 0;

	// If the pointer moves more than this many pixels while down, treat it as a drag
	const DRAG_THRESHOLD = 8;
	let wasDragged = $state(false);

	let isLightboxOpen = $state(false);
	let lightboxIndex = $state(0);
	let activeIndex = $state(0);

	let webmAvailable: Record<string, boolean | undefined> = $state({});

	async function checkWebmFor(imgSrc: string) {
		if (!imgSrc.toLowerCase().endsWith('.gif')) return;
		if (webmAvailable[imgSrc] !== undefined) return;

		const webmUrl = `${env.PUBLIC_FILE_SERVER_URL}${imgSrc}.webm`;
		try {
			const res = await fetch(webmUrl, { method: 'HEAD' });
			webmAvailable[imgSrc] = res.ok;
		} catch {
			webmAvailable[imgSrc] = false;
		}
	}

	// Filter only image media for the lightbox from the complete set if available
	let lightboxImages = $derived(
		(allPostMedia.length > 0 ? allPostMedia : media).filter((m) => m.type === 'image')
	);

	// For the carousel display itself, just use the provided media prop
	let displayImages = $derived(media.filter((m) => m.type === 'image'));

	function openLightbox(index: number) {
		// Find the index in the full lightbox set
		const img = displayImages[index];
		const fullIndex = lightboxImages.findIndex((i) => i.imgSrc === img.imgSrc);

		if (fullIndex !== -1) {
			lightboxIndex = fullIndex;
			isLightboxOpen = true;
		}
	}

	function closeLightbox() {
		isLightboxOpen = false;
	}

	function handleMouseDown(e: MouseEvent) {
		if (!scrollContainer) return;
		isDown = true;
		wasDragged = false;
		startX = e.pageX - scrollContainer.offsetLeft;
		scrollLeft = scrollContainer.scrollLeft;
	}

	function handleMouseLeave() {
		isDown = false;
	}

	function handleMouseUp() {
		isDown = false;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDown || !scrollContainer) return;
		e.preventDefault();
		const x = e.pageX - scrollContainer.offsetLeft;
		if (!wasDragged && Math.abs(x - startX) > DRAG_THRESHOLD) {
			wasDragged = true;
		}
		const walk = (x - startX) * 2;
		scrollContainer.scrollLeft = scrollLeft - walk;
	}

	function getItemWidth() {
		if (itemWidth > 0) return itemWidth;
		const item = scrollContainer?.querySelector('.gallery-item');
		if (item && scrollContainer) {
			// Measure distance between two items centers to determine scroll step
			const items = scrollContainer.querySelectorAll('.gallery-item');
			if (items.length >= 2) {
				const center1 =
					(items[0] as HTMLElement).offsetLeft + (items[0] as HTMLElement).offsetWidth / 2;
				const center2 =
					(items[1] as HTMLElement).offsetLeft + (items[1] as HTMLElement).offsetWidth / 2;
				itemWidth = center2 - center1;
				return itemWidth;
			}
		}
		return 0; // Fallback
	}

	function getClosestIndex() {
		if (!scrollContainer) return 0;
		const containerRect = scrollContainer.getBoundingClientRect();
		const containerCenter = containerRect.left + containerRect.width / 2;

		const items = scrollContainer.querySelectorAll('.gallery-item');
		let closestIndex = 0;
		let minDiff = Infinity;

		items.forEach((item, index) => {
			const rect = item.getBoundingClientRect();
			const itemCenter = rect.left + rect.width / 2;
			const diff = Math.abs(itemCenter - containerCenter);
			if (diff < minDiff) {
				minDiff = diff;
				closestIndex = index;
			}
		});
		return closestIndex;
	}

	function scrollToItem(index: number) {
		if (!scrollContainer) return;
		const items = scrollContainer.querySelectorAll('.gallery-item');
		if (index < 0 || index >= items.length) return;
		
		const item = items[index] as HTMLElement;
		const containerRect = scrollContainer.getBoundingClientRect();
		const containerCenter = containerRect.left + containerRect.width / 2;
		
		const itemRect = item.getBoundingClientRect();
		const itemCenter = itemRect.left + itemRect.width / 2;
		
		const diff = itemCenter - containerCenter;
		
		scrollContainer.scrollBy({ left: diff, behavior: 'smooth' });
	}

	function scrollPrev() {
		const index = getClosestIndex();
		if (index > 0) {
			scrollToItem(index - 1);
		}
	}

	function scrollNext() {
		const index = getClosestIndex();
		const items = scrollContainer?.querySelectorAll('.gallery-item');
		if (items && index < items.length - 1) {
			scrollToItem(index + 1);
		}
	}

	function handleScroll() {
		activeIndex = getClosestIndex();
	}

	onMount(async () => {
		await tick();
		if (scrollContainer) {
			// Calculate item width for buttons
			setTimeout(() => getItemWidth(), 500);
			// Calculate initial active index
			handleScroll();
		}

		// Check for webm replacements for gifs
		displayImages.forEach((img) => {
			checkWebmFor(img.imgSrc);
		});
	});
</script>

{#if isLightboxOpen}
	<Lightbox images={lightboxImages} startIndex={lightboxIndex} onClose={closeLightbox} />
{/if}

<div class="gallery-container relative flex w-full items-center justify-center {className}">
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
        id={"gallery-row-" + selfUniqueId}
		class="gallery-row"
		bind:this={scrollContainer}
		role="group"
		aria-label="Carousel"
		class:active={isDown}
		onmousedown={handleMouseDown}
		onmouseleave={handleMouseLeave}
		onmouseup={handleMouseUp}
		onmousemove={handleMouseMove}
		onscroll={handleScroll}
	>
		<!-- eslint-disable-next-line svelte/require-each-key -->
		{#each displayImages as item, i}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="gallery-item select-none" onclick={() => !wasDragged && openLightbox(i)}>
				<div class="gallery-image-container shadow-2xl" id={"gallery-item-" + selfUniqueId + "-" + i}>
					{#if webmAvailable[item.imgSrc]}
						<video
							src={`${env.PUBLIC_FILE_SERVER_URL}${item.imgSrc}.webm`}
							class="gallery-image"
							muted
							playsinline
							autoplay
							loop
							preload="metadata"
							draggable="false"
						>
							<track kind="captions">
						</video>
					{:else}
						<img
							id={"gallery-img-" + selfUniqueId + "-" + i}
							src={`${env.PUBLIC_FILE_SERVER_URL}${item.imgSrc}`}
							class="gallery-image"
							alt={item.alt || ''}
							draggable="false"
						/>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Scroll Indicator (Dots) -->
{#if displayImages.length > 1}
	<div class="flex justify-center gap-2 mb-2">
		{#each displayImages as _item, i}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="w-3 h-3 rounded-full cursor-pointer transition-colors duration-300"
				class:bg-primary={i === activeIndex}
				class:bg-neutral-600={i !== activeIndex}
				onclick={() => scrollToItem(i)}
			></div>
		{/each}
	</div>
{/if}

<div class="flex gap-2 items-center justify-center">
	<ButtonGlassBlack class="grow" onclick={scrollPrev}><i class="fa fa-chevron-left"></i></ButtonGlassBlack>
	<ButtonGlassBlack class="grow" onclick={scrollNext}><i class="fa fa-chevron-right"></i></ButtonGlassBlack>
</div>

<style scoped>
	.gallery-container {
		width: 100%;
		max-width: 100vw;
		overflow: hidden;
	}

	.gallery-row {
		height: auto;
		display: flex;
		align-items: center;
		justify-content: flex-start; /* Align left for scrolling */
		overflow-x: auto;
		width: 100%;
		max-width: 100vw;
		padding: 1rem 0; /* Vertical padding */

		scroll-behavior: smooth;
		/* scroll-snap-type: x mandatory; removed */

		cursor: grab;

		/* Hide scrollbar */
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE/Edge */
	}

	.gallery-row.active {
		cursor: grabbing;
		cursor: -webkit-grabbing;
		scroll-behavior: auto;
		/* scroll-snap-type: none; default */
	}

	.gallery-row::-webkit-scrollbar {
		display: none;
	}

	.gallery-item {
		width: calc(100% - 1rem); /* Full width minus margin for overlap */
		max-width: 30rem;
		height: auto;
		margin: 0 0.5rem; /* Horizontal margin for spacing */
		flex-shrink: 0;
		/* scroll-snap-align: center; removed */
	}

	/* Add padding to the start/end so the first/last items can be centered */
	.gallery-row::before,
	.gallery-row::after {
		content: '';
		display: block;
		min-width: calc(
			50% - 20rem + 4rem
		); /* Half container - half item + margin overlap compensation */
		height: 1px;
	}

	.gallery-image-container {
		height: auto;
		width: auto;
		overflow: hidden;
		border-radius: 0.5rem;
	}

	.gallery-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: filter 0.3s ease;
	}

	.gallery-image:hover {
		transition: filter 0.3s ease;
		filter: brightness(0.85);
		cursor: zoom-in;
	}
</style>
