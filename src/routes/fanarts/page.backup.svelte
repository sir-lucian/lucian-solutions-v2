<script lang="ts">
	import { onMount } from 'svelte';
	import Container from '$lib/components/Container.svelte';
	import ContainerGlassBlack from '$lib/components/containers/ContainerGlassBlack.svelte';
	import ImageViewer from '$lib/components/ImageViewer.svelte';
	import Bokeh from '$lib/components/background/Bokeh.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import BadgeGlass from '$lib/components/badges/BadgeGlass.svelte';
	import ButtonGlass from '$lib/components/buttons/ButtonGlass.svelte';
	import { fetchFanarts, transformArtToMedia } from '$lib/services/FanartService';
	import { MediaType } from '$lib';
	import type { Art, Media as MediaTypeDef, FanartItem } from '$lib';

	// Runes states
	import { writable } from 'svelte/store';
	
	let fanarts = writable<FanartItem[]>([]);
	let artists = writable<{ name: string; slug?: string | null; items: Art[] }[]>([]); // { name, slug, items }
	let selectedArtist = writable<string | null>(null);
	let isLoading = writable(true);

	// Character sheet media for top of page
	const characterSheetMedia: MediaTypeDef[] = [
		{
			type: MediaType.Image,
			imgSrc: `/files/posts/2024/2024-11-17-01-1.png`,
			altText: 'Character Sheet',
			imgLazyLoad: true
		}
	];

	onMount(async () => {
		isLoading.set(true);
		try {
			const data = await fetchFanarts();
			fanarts.set(data || []);
		} catch (err) {
			console.error('Failed to fetch fanarts:', err);
		} finally {
			isLoading.set(false);
		}
	});

	$: {
		// Build artists list from fetched fanarts
		const list: { name: string; slug?: string | null; items: Art[] }[] = [];
		$fanarts.forEach((f: FanartItem) => {
			const existing = list.find((a) => a.name === f.artist && (a.slug ?? null) === (f.slug ?? null));
			if (existing) {
				existing.items = [...existing.items, ...(f.art || [])];
			} else {
				list.push({ name: f.artist, slug: f.slug ?? null, items: f.art || [] });
			}
		});
		artists.set(list);
	}

	function artistLabel(a: { name: string; slug?: string | null }) {
		return a.slug ? `${a.name} (${a.slug})` : a.name;
	}

	function artToMediaArray(art: Art, artistName: string): MediaTypeDef[] {
		if (art.children && Array.isArray(art.children) && art.children.length > 0) {
			return art.children.map((c: Art) => transformArtToMedia(c, artistName));
		}
		return [transformArtToMedia(art, artistName)];
	}

	function selectArtist(name: string) {
		selectedArtist.update(current => current === name ? null : name);
		// scroll to top of list when selected
		// window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<SEO title="Fanarts" description="Fanart gallery" />

<Bokeh />

{#snippet sidebarLegend(isSticky = false)}
	<ContainerGlassBlack
		class={`menu w-full opacity-90 p-2 ${isSticky ? 'flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100  max-h-[calc(100vh-8rem)]' : ''}`}
	>
		<div class="menu-title flex-none flex flex-row justify-between items-center px-2 py-2 border-b border-white/10 mb-2">
			<span class="text-primary uppercase"><i class="fa-solid fa-archive"></i> Artists</span>
		</div>
		<div class={`${isSticky ? 'flex-1  pr-1' : ''}`}>
			<ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2 w-full">
				{#each $artists as group}
					<li>
						<button
							class={`btn btn-ghost w-full justify-between h-auto min-h-0 py-2 hover:bg-white/5 hover:border-white/10 hover:border ${$selectedArtist === group.name ? 'btn-active bg-white/10 border-white/10 border' : ''}`}
							onclick={() => selectArtist(group.name)}
						>
							<span class="font-bold">{artistLabel(group)}</span>
							<BadgeGlass class="pointer-events-none">{group.items.length}</BadgeGlass>
						</button>
					</li>
				{/each}
			</ul>
		</div>
		{#if isSticky}
			<div class="flex-none pt-2 border-t border-neutral-700 mt-2">
				<ButtonGlass 
					class="w-full gap-2"
					onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				>
					<i class="fa-solid fa-arrow-up"></i> Go To Top
				</ButtonGlass>
			</div>
		{/if}
	</ContainerGlassBlack>
{/snippet}

<section class="content-section">
	<Container>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<h2 class="text-3xl font-bold text-primary uppercase">
					<i class="fa-solid fa-image"></i> Fanarts
				</h2>
				<p>Fan artworks grouped by artist</p>
			</div>

			<!-- Character sheet -->
			<div class="w-full">
				<ContainerGlassBlack class="p-4 mb-4">
					<ImageViewer media={characterSheetMedia} allPostMedia={characterSheetMedia} />
				</ContainerGlassBlack>
			</div>

			<!-- Small-screen sidebar legend under character sheet -->
			<div class="lg:hidden w-full">
				{@render sidebarLegend()}
			</div>
		</div>

		<div class="flex gap-8 lg:flex-row flex-col">
			<!-- Main column -->
			<div class="flex-1">
				{#if $isLoading}
					<div class="flex justify-center items-center py-20">
						<span class="loading loading-spinner loading-lg text-primary"></span>
					</div>
				{:else}
					{#if !$selectedArtist}
						<ContainerGlassBlack class="p-4">Select an artist from the sidebar to view their fanarts.</ContainerGlassBlack>
					{:else}
						{#each $artists.filter(a => a.name === $selectedArtist) as artist}
							<ContainerGlassBlack class="p-4 mb-4">
								<header class="mb-4 flex items-center justify-between">
									<h3 class="text-2xl font-bold">{artistLabel(artist)}</h3>
								</header>
								<div class="flex flex-col gap-4">
									{#each artist.items as art}
										<ImageViewer media={artToMediaArray(art, artist.name)} allPostMedia={artToMediaArray(art, artist.name)} />
									{/each}
								</div>
							</ContainerGlassBlack>
						{/each}
					{/if}
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="hidden lg:block w-64">
				<div class="sticky top-24">
					{@render sidebarLegend(true)}
				</div>
			</div>
		</div>
	</Container>
</section>

<style scoped>
	.content-section { padding: 1rem 0; }
</style>
