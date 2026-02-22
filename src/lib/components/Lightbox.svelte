<script lang="ts">
	import { fade } from 'svelte/transition';
	import { MASTER_URL_PREFIX, type Media } from '$lib/index';
	import { onMount } from 'svelte';

	export let images: Media[];
	export let startIndex: number = 0;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export let onClose: () => void;

	let index = startIndex;
	let isLoading = true;

	$: currentImage = images[index];

	function nextImage(e: Event) {
		e.stopPropagation();
		index = (index + 1) % images.length;
		isLoading = true;
	}

	function prevImage(e: Event) {
		e.stopPropagation();
		index = (index - 1 + images.length) % images.length;
		isLoading = true;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
		if (e.key === 'ArrowRight') nextImage(e);
		if (e.key === 'ArrowLeft') prevImage(e);
	}

	onMount(() => {
		const originalOverflow = document.body.style.overflow;
		const originalPaddingRight = document.body.style.paddingRight;
		
        // Prevent scrolling but keep the scrollbar visible to avoid layout shift
		document.body.style.overflow = 'hidden';
        
        // Compensate for the missing scrollbar space
		const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
		
		return () => {
			document.body.style.overflow = originalOverflow;
			document.body.style.paddingRight = originalPaddingRight;
		};
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
	transition:fade={{ duration: 200 }}
	on:click={onClose}
>
	<!-- Close Button -->
	<button
		class="btn btn-circle btn-ghost absolute right-4 top-4 z-50 text-white"
        aria-label="Close Lightbox"
		on:click={(e) => {
			e.stopPropagation();
			onClose();
		}}
	>
		<i class="fa-solid fa-xmark text-2xl"></i>
	</button>

	<!-- Navigation Previous -->
	{#if images.length > 1}
		<button
			class="btn btn-circle btn-ghost absolute left-4 z-50 text-white hidden md:flex"
            aria-label="Previous Image"
			on:click={prevImage}
		>
			<i class="fa-solid fa-chevron-left text-2xl"></i>
		</button>
	{/if}

	<!-- Image Container -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div
		class="relative flex h-full w-full items-center justify-center p-4"
	>
		{#if isLoading}
			<div class="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
				<span class="loading loading-spinner loading-lg text-primary"></span>
			</div>
		{/if}
		{#key index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img
				src={MASTER_URL_PREFIX + currentImage.imgSrc}
				alt={currentImage.altText || 'Lightbox Image'}
				class={`absolute max-h-[calc(100%-2rem)] max-w-[calc(100%-2rem)] object-contain shadow-2xl rounded-lg transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
				transition:fade={{ duration: 300 }}
				draggable="false"
				on:click={(e) => e.stopPropagation()}
				on:load={() => isLoading = false}
			/>
		{/key}
	</div>

	<!-- Navigation Next -->
	{#if images.length > 1}
		<button
			class="btn btn-circle btn-ghost absolute right-4 z-50 text-white hidden md:flex"
            aria-label="Next Image"
			on:click={nextImage}
		>
			<i class="fa-solid fa-chevron-right text-2xl"></i>
		</button>
	{/if}

    <!-- Image Counter -->
    {#if images.length > 1}
        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 -translate-y-3 rounded-full bg-black/50 px-4 py-2 text-sm text-white font-black backdrop-blur-md">
            {index + 1} / {images.length}
        </div>
    {/if}
</div>
