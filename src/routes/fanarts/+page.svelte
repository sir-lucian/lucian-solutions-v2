<script lang="ts">
	import { onMount } from 'svelte';
	import Container from '$lib/components/Container.svelte';
	import ContainerGlassBlack from '$lib/components/containers/ContainerGlassBlack.svelte';
	import Bokeh from '$lib/components/background/Bokeh.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import ButtonGlass from '$lib/components/buttons/ButtonGlass.svelte';
	import { fetchFanarts, transformArtToMedia } from '$lib/services/FanartService';
	import { MediaType } from '$lib';
	import type { Art, Media as MediaTypeDef, FanartItem } from '$lib';

	// Page data provided by +page.ts
	export let data: { fanarts?: FanartItem[] };

	// Runes states
	import { writable } from 'svelte/store';
	import Footer from '$lib/components/Footer.svelte';
	import ImageViewer2 from '$lib/components/ImageViewer2.svelte';
	import ImageViewer from '$lib/components/ImageViewer.svelte';
	import ArtistSelector from '$lib/components/ArtistSelector.svelte';

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
			let list = data?.fanarts ?? null;
			if (!list) {
				list = await fetchFanarts();
			}
			fanarts.set(list || []);
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
			const existing = list.find(
				(a) => a.name === f.artist && (a.slug ?? null) === (f.slug ?? null)
			);
			if (existing) {
				existing.items = [...existing.items, ...(f.art || [])];
			} else {
				list.push({ name: f.artist, slug: f.slug ?? null, items: f.art || [] });
			}
		});

		// Sort top-level art pieces for each artist from last -> first. Do NOT sort `children` arrays.
		for (const a of list) {
			a.items = (a.items || []).slice().reverse();
		}
		artists.set(list);
	}

	function artistLabel(a: { name: string; slug?: string | null }) {
		return a.slug ? `${a.name} (${a.slug})` : a.name;
	}

	function artToMediaArray(art: Art, artistName: string): MediaTypeDef[] {
		if (art.children && Array.isArray(art.children) && art.children.length > 0) {
			const tempArray = art.children.map((c: Art) => transformArtToMedia(c, artistName));
			const parentMedia = transformArtToMedia(art, artistName);
			return [parentMedia, ...tempArray];
		}
		return [transformArtToMedia(art, artistName)];
	}
</script>

<SEO title="Fanarts" description="Community's Contribution" />

<Bokeh />

<section class="content-section">
	<Container>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<h2 class="text-3xl font-bold text-primary uppercase">
					<i class="fa-solid fa-image"></i> Fanarts
				</h2>
				<p>Community's Contribution</p>
			</div>

			<!-- Character sheet -->
			<div class="w-full">
				<ContainerGlassBlack class="p-4">
					<h3 class="mb-4 text-2xl font-bold text-white">
						<i class="fa-solid fa-id-card"></i> Character Sheet
					</h3>
					<ImageViewer media={characterSheetMedia} allPostMedia={characterSheetMedia} />
				</ContainerGlassBlack>
			</div>
		</div>

		<ArtistSelector
			artists={$artists}
			selectedArtist={$selectedArtist}
			onSelect={(artistName) => {
				selectedArtist.set(artistName);
				// Scroll to the selected artist's section
				const section = document.getElementById(`artist-section-${artistName}`);
				const defaultBox = document.getElementById(`gallery-box`);
				if (section) {
					section.scrollIntoView({ behavior: 'smooth' });
				} else if (defaultBox) {
					defaultBox.scrollIntoView({ behavior: 'smooth' });
				}
			}}
		/>

		<div class="flex flex-col gap-8">
			<!-- Main column -->
			<div class="flex-1" id="gallery-box">
				{#if $isLoading}
					<div class="flex items-center justify-center py-20">
						<span class="loading loading-lg loading-spinner text-primary"></span>
					</div>
				{:else if !$selectedArtist}
					<ContainerGlassBlack class="p-4">
						<div class="flex flex-wrap items-center justify-between gap-2">
							<div class="inline-flex items-center gap-2">
								<i class="fa-solid fa-info-circle"></i><span
									>Select an artist to view their fanarts.</span
								>
							</div>
							<div
								class="hidden animate-pulse items-center gap-2 text-sm text-primary lg:inline-flex"
							>
								<span>Click an artist</span>
								<i class="fa-solid fa-arrow-up"></i>
							</div>
							<ButtonGlass
								class="mt-4 w-full gap-2 lg:hidden"
								onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							>
								<span>Click an artist</span>
								<i class="fa-solid fa-arrow-up"></i>
							</ButtonGlass>
						</div>
					</ContainerGlassBlack>
				{:else}
					{#each $artists.filter((a) => a.name === $selectedArtist) as artist (artist.name)}
						<ContainerGlassBlack class="mb-4 p-4" id={`artist-section-${artist.name}`}>
							<header class="mb-4 flex items-center justify-between">
								<h3 class="text-2xl font-bold text-white">
									<i class="fa-solid fa-palette"></i>
									{artistLabel(artist)}
								</h3>
							</header>
							<div class="flex flex-col gap-4 w-full">
								<!-- eslint-disable-next-line svelte/require-each-key -->
								{#each artist.items as art, index}
									{#if art.children && Array.isArray(art.children) && art.children.length > 0}
										<ImageViewer2
											media={artToMediaArray(art, artist.name)}
											allPostMedia={artToMediaArray(art, artist.name)}
										/>
									{:else}
										<ImageViewer
											media={artToMediaArray(art, artist.name)}
											allPostMedia={artToMediaArray(art, artist.name)}
										/>
									{/if}
									{#if index < artist.items.length - 1}
										<div class="divider-base-content divider my-0">◆◆◆</div>
									{/if}
								{/each}
							</div>
						</ContainerGlassBlack>
					{/each}
				{/if}
			</div>
		</div>
	</Container>
</section>

<section id="footer">
	<Footer />
</section>


<style scoped>
	.content-section {
		padding: 1rem 0;
	}
</style>
