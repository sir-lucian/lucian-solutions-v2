<script lang="ts">
	import YouTubeEmbed from '$lib/components/YouTubeEmbed.svelte';
	import type { Media } from '$lib/index';
	import Lightbox from './Lightbox.svelte';

	export let media: Media[] = [];

	let isLightboxOpen = false;
	let lightboxIndex = 0;

	// Filter only image media for the lightbox
	$: lightboxImages = media.filter((m) => m.type === 'image');

	function openLightbox(item: Media) {
		const index = lightboxImages.findIndex((img) => img === item);
		if (index !== -1) {
			lightboxIndex = index;
			isLightboxOpen = true;
		}
	}

	function closeLightbox() {
		isLightboxOpen = false;
	}

	$: hasYoutube = media.some((m) => m.type === 'youtube');
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
		{#if media[0].type === 'youtube'}
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
		{:else if media[0].type === 'image'}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img
				src={media[0].imgSrc}
				alt={media[0].altText || 'Image'}
				loading={media[0].imgLazyLoad ? 'lazy' : 'eager'}
				class="h-auto max-w-full cursor-zoom-in rounded-lg shadow-lg hover:brightness-90 transition w-full"
				on:click={() => openLightbox(media[0])}
			/>
		{/if}
	</div>
{:else if media.length > 1}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each media as item}
			<div
				class={`w-full overflow-hidden rounded-lg shadow-lg ${hasYoutube ? 'aspect-video' : 'aspect-square'}`}
			>
				{#if item.type === 'youtube'}
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
				{:else if item.type === 'image'}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<img
						src={item.imgSrc}
						alt={item.altText || 'Image'}
						loading={item.imgLazyLoad ? 'lazy' : 'eager'}
						class="h-full w-full cursor-zoom-in object-cover hover:brightness-90 transition"
						on:click={() => openLightbox(item)}
					/>
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