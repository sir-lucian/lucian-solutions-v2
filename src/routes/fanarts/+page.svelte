<script lang="ts">
	import { onMount, tick } from 'svelte';
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

	// Page data provided by +page.ts
	export let data: { fanarts?: FanartItem[] };

	// Runes states
	import { writable } from 'svelte/store';

	let fanarts = writable<FanartItem[]>([]);
	let artists = writable<{ name: string; slug?: string | null; items: Art[] }[]>([]); // { name, slug, items }
	let selectedArtist = writable<string | null>(null);
	let artistSectionEl: HTMLElement | null = null;
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

	async function selectArtist(name: string) {
		selectedArtist.update((current) => (current === name ? null : name));
		const artistName = $selectedArtist;
		// wait for DOM update then scroll the artist posts into view
		await tick();
		if (artistName) {
			const artistSectionEl = document.getElementById(`artist-section-${artistName}`);
			if (artistSectionEl) {
				artistSectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}
</script>

<SEO title="Fanarts" description="Community's Contribution" />

<Bokeh />

{#snippet sidebarLegend(isSticky = false)}
	<ContainerGlassBlack
		class={`menu w-full p-2 opacity-90 ${isSticky ? 'scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 flex max-h-[calc(100vh-8rem)] flex-col  overflow-y-auto' : ''}`}
	>
		<div
			class="mb-2 flex flex-none flex-row items-center justify-between border-b border-white/10 menu-title px-2 py-2"
		>
			<span class="text-primary uppercase"><i class="fa-solid fa-archive"></i> Artists</span>
		</div>
		<div class={`${isSticky ? 'flex-1  pr-1' : ''}`}>
			<ul class="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
				{#each $artists as group}
					<li>
						<button
							class={`btn h-auto min-h-0 w-full justify-between py-2 btn-ghost hover:border hover:border-white/10 hover:bg-white/5 ${$selectedArtist === group.name ? 'btn-active border border-white/10 bg-white/10' : ''}`}
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
			<div class="mt-2 flex-none border-t border-neutral-700 pt-2">
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
				<p>Community's Contribution</p>
			</div>

			<!-- Character sheet -->
			<div class="w-full">
				<ContainerGlassBlack class="mb-4 p-4">
					<h3 class="mb-4 text-2xl font-bold text-white">
						<i class="fa-solid fa-id-card"></i> Character Sheet
					</h3>
					<ImageViewer media={characterSheetMedia} allPostMedia={characterSheetMedia} />
				</ContainerGlassBlack>
			</div>

			<!-- Small-screen sidebar legend under character sheet -->
			<div class="w-full lg:hidden">
				{@render sidebarLegend()}
			</div>
		</div>

		<div class="flex flex-col gap-8 lg:flex-row">
			<!-- Main column -->
			<div class="flex-1">
				{#if $isLoading}
					<div class="flex items-center justify-center py-20">
						<span class="loading loading-lg loading-spinner text-primary"></span>
					</div>
				{:else if !$selectedArtist}
					<ContainerGlassBlack class="p-4">
						<div class="flex flex-wrap items-center justify-between gap-2">
							<div class="inline-flex items-center gap-2">
								<i class="fa-solid fa-info-circle"></i><span
									>Select an artist from the sidebar to view their fanarts.</span
								>
							</div>
							<div
								class="hidden animate-pulse items-center gap-2 text-sm text-primary lg:inline-flex"
							>
								<span>Click an artist</span>
								<i class="fa-solid fa-arrow-right"></i>
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
					{#each $artists.filter((a) => a.name === $selectedArtist) as artist}
						<ContainerGlassBlack class="mb-4 p-4" id={`artist-section-${artist.name}`}>
							<header class="mb-4 flex items-center justify-between">
								<h3 class="text-2xl font-bold text-white">
									<i class="fa-solid fa-palette"></i>
									{artistLabel(artist)}
								</h3>
							</header>
							<div class="flex flex-col gap-4">
								{#each artist.items as art, index}
									<ImageViewer
										media={artToMediaArray(art, artist.name)}
										allPostMedia={artToMediaArray(art, artist.name)}
									/>
									{#if index < artist.items.length - 1}
										<div class="divider-base-content divider my-0">◆◆◆</div>
									{/if}
								{/each}
							</div>
						</ContainerGlassBlack>
					{/each}
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="hidden w-64 lg:block">
				<div class="sticky top-24">
					{@render sidebarLegend(true)}
				</div>
			</div>
		</div>
	</Container>
</section>

<style scoped>
	.content-section {
		padding: 1rem 0;
	}
</style>
