<script lang="ts">
	import YouTubeEmbed from '$lib/components/YouTubeEmbed.svelte';
	import { MediaType, type Media } from '$lib/index';
	import Lightbox from './Lightbox.svelte';
	import { env } from '$env/dynamic/public';
	import { onDestroy } from 'svelte';

	export let media: Media[] = [];
	export let allPostMedia: Media[] = [];

	let isLightboxOpen = false;
	let lightboxIndex = 0;
	
	// Map to track loaded state of images
	let loadedImages: Record<string, boolean> = {};

	// Map to track whether an image's `src` has been assigned (is visible or forced)
	let visibleImages: Record<string, boolean> = {};

	let observer: IntersectionObserver | null = null;
	const observed = new Map<Element, string>();

	function ensureObserver() {
		if (observer) return;
		observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				const key = observed.get(entry.target);
				if (!key) continue;
				if (entry.isIntersecting) {
					visibleImages = { ...visibleImages, [key]: true };
					// stop observing this element
					observer?.unobserve(entry.target);
					observed.delete(entry.target);
				}
			}
		}, { root: null, rootMargin: '200px', threshold: 0.05 });
	}

	function observeImage(el: Element | null, key: string, shouldLazy = true) {
		if (!el) {
			// element removed -> clean up any previous mapping for this key
			for (const [elem, k] of observed.entries()) {
				if (k === key) {
					observer?.unobserve(elem);
					observed.delete(elem);
				}
			}
			return;
		}

		if (!shouldLazy) {
				visibleImages = { ...visibleImages, [key]: true };
			return;
		}

		ensureObserver();
		observed.set(el, key);
		observer?.observe(el);
	}


	// Svelte action to attach lazy/deferred loading to an element
	function deferLoad(node: HTMLElement, params: { key: string; lazy?: boolean }) {
		let key = params.key;
		let lazy = params.lazy ?? true;
		observeImage(node, key, lazy);

		return {
			update(newParams: { key: string; lazy?: boolean }) {
				if (newParams.key !== key) {
					observeImage(null, key);
					key = newParams.key;
					lazy = newParams.lazy ?? true;
					observeImage(node, key, lazy);
				} else if ((newParams.lazy ?? true) !== lazy) {
					// re-register if lazy flag changed
					observeImage(null, key);
					lazy = newParams.lazy ?? true;
					observeImage(node, key, lazy);
				}
			},
			destroy() {
				observeImage(null, key);
			}
		};
	}

	// cleanup observer on component destroy
	onDestroy(() => {
		observer?.disconnect();
		observed.clear();
	});

	function handleImageLoad(src: string) {
		loadedImages = { ...loadedImages, [src]: true };
	}

	// Filter only image media for the lightbox from the complete set if available
	$: lightboxImages = (allPostMedia.length > 0 ? allPostMedia : media).filter((m) => m.type === 'image');

	function openLightbox(item: Media) {
		const index = lightboxImages.findIndex((img) => img.imgSrc === item.imgSrc);
		if (index !== -1) {
			lightboxIndex = index;
			isLightboxOpen = true;
		}
	}

	function closeLightbox() {
		isLightboxOpen = false;
	}

	$: hasYoutube = media.some((m) => m.type === MediaType.YouTube);
	
	// Determine if we need the special layout for odd number of items > 1
	// If odd > 1, the last 3 items will share a row (3 columns), others will be in pairs (2 columns)
	// To achieve this with a single grid, we use a 6-column grid:
	// - Normal items span 3 columns (2 per row)
	// - Last 3 items span 2 columns (3 per row)
	$: isOddLayout = media.length > 1 && media.length % 2 !== 0;
</script>

{#if isLightboxOpen}
	<Lightbox
		images={lightboxImages}
		startIndex={lightboxIndex}
		onClose={closeLightbox}
	/>
{/if}

{#if media.length === 1}
	<div class="flex w-full justify-center">
		{#if media[0].type === MediaType.YouTube}
			<YouTubeEmbed width="w-full">
				<iframe
					width="100%"
					height="100%"
					src={media[0].embededUrl}
					title="YouTube Video Player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</YouTubeEmbed>
		{:else if media[0].type === MediaType.Image}
			{@const src = `${env.PUBLIC_FILE_SERVER_URL}${media[0].imgSrc}`}
			{@const assignedSrc = visibleImages[src] ? src : undefined}
			<div class="relative w-full overflow-hidden rounded-lg shadow-lg">
				{#if !loadedImages[src]}
					<div class="absolute inset-0 flex items-center justify-center bg-neutral-800">
						<span class="loading loading-spinner loading-lg text-primary"></span>
					</div>
				{/if}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<img
					src={assignedSrc}
					alt={media[0].altText || 'Image'}
					loading={media[0].imgLazyLoad ? 'lazy' : 'eager'}
					decoding="async"
					use:deferLoad={{ key: src, lazy: media[0].imgLazyLoad !== false }}
					class={`h-auto max-w-full cursor-zoom-in hover:brightness-90 transition duration-300 w-full ${!loadedImages[src] ? 'opacity-0' : 'opacity-100'}`}
					on:click={() => openLightbox(media[0])}
					on:load={() => handleImageLoad(src)}
				/>
			</div>
		{/if}
	</div>
{:else if media.length > 1}
	<div 
		class={`grid grid-cols-1 gap-4 ${isOddLayout ? 'md:grid-cols-6' : 'md:grid-cols-2'}`}
	>
		{#each media as item, index}
			{@const isLastThree = isOddLayout && index >= media.length - 3}
			<div
				class={`w-full overflow-hidden rounded-lg shadow-lg ${hasYoutube ? 'aspect-video' : 'aspect-square'}
				${isOddLayout 
					? (isLastThree ? 'md:col-span-2' : 'md:col-span-3') 
					: ''}
				`}
			>
				{#if item.type === MediaType.YouTube}
					<YouTubeEmbed width="w-full h-full">
						<iframe
							width="100%"
							height="100%"
							src={item.embededUrl}
							title="YouTube Video Player"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
							class="h-full w-full"
						></iframe>
					</YouTubeEmbed>
				{:else if item.type === MediaType.Image}
					{@const src = `${env.PUBLIC_FILE_SERVER_URL}${item.imgSrc}`}
					{@const assignedSrc = visibleImages[src] ? src : undefined}
					<div class="relative w-full h-full bg-neutral-800">
						{#if !loadedImages[src]}
							<div class="absolute inset-0 flex items-center justify-center">
								<span class="loading loading-spinner loading-md text-primary"></span>
							</div>
						{/if}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<img
							src={assignedSrc}
							alt={item.altText || 'Image'}
							loading={item.imgLazyLoad ? 'lazy' : 'eager'}
							decoding="async"
							use:deferLoad={{ key: src, lazy: item.imgLazyLoad !== false }}
							class={`h-full w-full object-cover cursor-zoom-in hover:brightness-90 transition duration-300 ${!loadedImages[src] ? 'opacity-0' : 'opacity-100'}`}
							on:click={() => openLightbox(item)}
							on:load={() => handleImageLoad(src)}
						/>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style scoped>
    /* Optional: Add custom styles for the image grid or lightbox here */
    img {
        transition: 0.3s ease-in-out;
    }

</style>