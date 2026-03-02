<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import Container from '$lib/components/Container.svelte';
	import ImageViewer from '$lib/components/ImageViewer.svelte';
	import ButtonGlass from '$lib/components/buttons/ButtonGlass.svelte';
	import ButtonGlassBlack from '$lib/components/buttons/ButtonGlassBlack.svelte';
	import BadgeGlass from '$lib/components/badges/BadgeGlass.svelte';
	import BadgeGlassBlack from '$lib/components/badges/BadgeGlassBlack.svelte';
	import ContainerGlassBlack from '$lib/components/containers/ContainerGlassBlack.svelte';
	import Bokeh from '$lib/components/background/Bokeh.svelte';
	import { fetchPosts } from '$lib/services/PostService';

	// Page data provided by +page.ts
	const { data } = $props<{ data: { posts?: any[]; post?: any } }>();
	import { twemojiParse } from '$lib/utils/twemoji';
	import { onMount, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { DEFAULT_SEO_IMAGE, HtmlType } from '$lib';

	// helpers
	function safeDate(date?: string) {
		return new Date(date ?? '1970-01-01');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function mapMediaItems(jsonMedias: any[]): any[] {
		return jsonMedias.map((m) => {
			let type = m.type;
			if (m.src) {
				const extension = m.src.split('.').pop()?.toLowerCase();
				if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) {
					type = 'image';
				}
			}
			return {
				type: type,
				imgSrc: m.src,
				altText: m.alt,
				embededUrl: m.embededUrl,
				imgLazyLoad: m.lazy ?? true
			};
		});
	}

	function getAllPostImages(post: Post): any[] {
		let allMedia: any[] = [];
		if (post.htmlItems) {
			post.htmlItems.forEach((item) => {
				if (item.type === 'media' && item.medias) {
					allMedia = [...allMedia, ...mapMediaItems(item.medias)];
				}
			});
		}
		return allMedia;
	}

	// types
	interface Post {
		id: string;
		title: string;
		slug: string;
		tags: string[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		htmlItems: any[];
		date?: string;
	}

	interface MonthGroup {
		monthName: string;
		monthIndex: number;
		posts: Post[];
	}

	interface YearGroup {
		year: number;
		months: MonthGroup[];
	}

	// data
	let sortedPosts = writable<Post[]>([]);

	let isLoading = $state(true);

	onMount(async () => {
		isLoading = true;
		try {
			let posts = data?.posts ?? null;
			if (!posts) {
				posts = await fetchPosts();
			}
			sortedPosts.set(
				posts
					.map((p: Post) => ({ ...p, date: p.date ?? '' }))
					.sort(
						(a: { date: string | undefined }, b: { date: string | undefined }) =>
							safeDate(b.date).getTime() - safeDate(a.date).getTime()
					)
			);

			// If the server provided a single post, set the singlePostId so filtered view shows it
			if (data?.post) {
				singlePostId = data.post.id ?? data.post.slug ?? null;
			}
		} catch (err) {
			console.error('Failed to fetch posts:', err);
		} finally {
			isLoading = false;
		}
	});

	// archive sidebar grouping (keeps updated when sortedPosts changes)
	let allGroupedPosts: YearGroup[] = $state([]);
	$effect(() => {
		const groups: YearGroup[] = [];
		$sortedPosts.forEach((post: Post) => {
			const date = safeDate(post.date);
			const year = date.getFullYear();
			const monthIndex = date.getMonth();
			const monthName = date.toLocaleString('default', { month: 'long' });

			let yearGroup = groups.find((g) => g.year === year);
			if (!yearGroup) {
				yearGroup = { year, months: [] };
				groups.push(yearGroup);
			}

			let monthGroup = yearGroup.months.find((m) => m.monthIndex === monthIndex);
			if (!monthGroup) {
				monthGroup = { monthName, monthIndex, posts: [] };
				yearGroup.months.push(monthGroup);
			}

			monthGroup.posts.push(post);
		});

		groups.sort((a, b) => b.year - a.year);
		groups.forEach((yearGroup) => {
			yearGroup.months.sort((a, b) => b.monthIndex - a.monthIndex);
			yearGroup.months.forEach((monthGroup) => {
				monthGroup.posts.sort((a, b) => safeDate(b.date).getTime() - safeDate(a.date).getTime());
			});
		});

		allGroupedPosts = groups;
	});

	// UI state
	let searchQuery = $state('');
	let activeSearchQuery = $state('');
	let selectedYear: number | null = $state(null);
	let selectedMonthIndex: number | null = $state(null);
	let singlePostId: string | null = $state(null);
	let copiedPostId: string | null = $state(null);
	let copyTimeout: NodeJS.Timeout;
	let isInitialized = $state(false);
	let holdFirstYearClick = $state(false); // Used to control scroll behavior when clicking year filter for first time with singlePostId active

	$effect(() => {
		const s = page.url.searchParams.get('s');
		singlePostId = s || null;
		if (singlePostId) {
			searchQuery = '';
			activeSearchQuery = '';
			selectedYear = null;
			selectedMonthIndex = null;
		}
		isInitialized = true;
	});

	// filtered posts (based on search/filters)
	let filteredPosts = $derived.by(() => {
		if (!isInitialized) return [];
		let posts = $sortedPosts;
		if (singlePostId) return posts.filter((p) => p.id === singlePostId);
		if (activeSearchQuery) {
			const q = activeSearchQuery.toLowerCase();
			posts = posts.filter((p) => p.title.toLowerCase().includes(q));
		} else if (selectedYear !== null) {
			posts = posts.filter((p) => {
				const d = safeDate(p.date);
				if (d.getFullYear() !== selectedYear) return false;
				if (selectedMonthIndex !== null && d.getMonth() !== selectedMonthIndex) return false;
				return true;
			});
		}
		return posts;
	});

	// grouped posts for display (all filtered)
	let groupedDisplayedPosts = $derived.by(() => {
		const groups: YearGroup[] = [];
		filteredPosts.forEach((post) => {
			const date = safeDate(post.date);
			const year = date.getFullYear();
			const monthIndex = date.getMonth();
			const monthName = date.toLocaleString('default', { month: 'long' });

			let yearGroup = groups.find((g) => g.year === year);
			if (!yearGroup) {
				yearGroup = { year, months: [] };
				groups.push(yearGroup);
			}

			let monthGroup = yearGroup.months.find((m) => m.monthIndex === monthIndex);
			if (!monthGroup) {
				monthGroup = { monthName, monthIndex, posts: [] };
				yearGroup.months.push(monthGroup);
			}

			monthGroup.posts.push(post);
		});

		groups.sort((a, b) => b.year - a.year);
		groups.forEach((group) => {
			group.months.sort((a, b) => b.monthIndex - a.monthIndex);
			group.months.forEach((m) => {
				m.posts.sort((a, b) => safeDate(b.date).getTime() - safeDate(a.date).getTime());
			});
		});
		return groups;
	});

	// Control visible count and limited grouped display
	let visibleCount = $state(8);
	let groupedDisplayedPostsLimited = $derived.by(() => {
		const groups: YearGroup[] = [];
		const visible = filteredPosts.slice(0, visibleCount);
		visible.forEach((post) => {
			const date = safeDate(post.date);
			const year = date.getFullYear();
			const monthIndex = date.getMonth();
			const monthName = date.toLocaleString('default', { month: 'long' });

			let yearGroup = groups.find((g) => g.year === year);
			if (!yearGroup) {
				yearGroup = { year, months: [] };
				groups.push(yearGroup);
			}

			let monthGroup = yearGroup.months.find((m) => m.monthIndex === monthIndex);
			if (!monthGroup) {
				monthGroup = { monthName, monthIndex, posts: [] };
				yearGroup.months.push(monthGroup);
			}

			monthGroup.posts.push(post);
		});

		groups.sort((a, b) => b.year - a.year);
		groups.forEach((group) => {
			group.months.sort((a, b) => b.monthIndex - a.monthIndex);
			group.months.forEach((m) => {
				m.posts.sort((a, b) => safeDate(b.date).getTime() - safeDate(a.date).getTime());
			});
		});
		return groups;
	});

	// UI helpers
	function clearFilters() {
		searchQuery = '';
		activeSearchQuery = '';
		selectedYear = null;
		selectedMonthIndex = null;
		singlePostId = null;
		goto('/posts', { replaceState: true });
		window.scrollTo({ top: 0, behavior: 'smooth' });
		holdFirstYearClick = false;
	}

	async function selectFilter(year: number, monthIndex: number | null = null) {
		const yearChanged = selectedYear !== year;
		if (yearChanged) {
			holdFirstYearClick = false; // reset holdFirstYearClick when changing to a different year filter
		}
		selectedYear = year;
		selectedMonthIndex = monthIndex;
		searchQuery = '';
		activeSearchQuery = '';
		if (singlePostId) {
			singlePostId = null;
			goto('/posts', { replaceState: true });
		} else {
			await tick();
			if (year && !monthIndex && !holdFirstYearClick) {
				holdFirstYearClick = true;
				// Don't scroll to main content on first year click if singlePostId was active since user is likely trying to clear that filter by clicking the year again
			} else {
				scrollToMainContent();
			}
		}
	}

	function performSearch() {
		if (singlePostId) {
			singlePostId = null;
			goto('/posts', { replaceState: true });
		}
		selectedYear = null;
		selectedMonthIndex = null;
		activeSearchQuery = searchQuery;
	}

	function handleSearchKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') performSearch();
	}

	function copyPostLink(postId: string) {
		const url = new URL(window.location.href);
		url.searchParams.set('s', postId);
		navigator.clipboard
			.writeText(url.toString())
			.then(() => {
				copiedPostId = postId;
				if (copyTimeout) clearTimeout(copyTimeout);
				copyTimeout = setTimeout(() => {
					copiedPostId = null;
				}, 2000);
			})
			.catch((err) => console.error('Failed to copy: ', err));
	}

	function scrollToMainContent() {
		const el = document.getElementById('main-content');
		holdFirstYearClick = false;
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
	// Compute SEO props; initialize with defaults and let $effect update from `data` or client state
	let currentSeo = $state({
		title: 'Posts',
		description: "Lucian's Blog Posts",
		image: DEFAULT_SEO_IMAGE
	});

	$effect(() => {
		if (data?.post) {
			currentSeo = {
				title: data.post.title,
				description: `Read "${data.post.title}" on Lucian Solutions.`,
				image: getAllPostImages(data.post).filter((m) => m.type === 'image')[0]?.imgSrc ?? DEFAULT_SEO_IMAGE
			};
			return;
		}

		if (singlePostId) {
			const post = $sortedPosts.find((p) => p.id === singlePostId);
			if (post) {
				const images = getAllPostImages(post).filter((m) => m.type === 'image');
				const firstImage = images.length > 0 ? `${images[0].imgSrc}` : undefined;
				currentSeo = {
					title: post.title,
					description: `Read "${post.title}" on Lucian Solutions.`,
					image: firstImage ?? DEFAULT_SEO_IMAGE
				};
				return;
			}
		}

		currentSeo = { title: 'Posts', description: "Lucian's Blog Posts", image: DEFAULT_SEO_IMAGE };
	});
</script>

<SEO
	title={currentSeo.title}
	description={currentSeo.description}
	image={currentSeo.image}
	url={page.url.href}
/>

<Bokeh />

{#snippet sidebarLegend(isSticky = false)}
	<ContainerGlassBlack
		class={`menu w-full p-2 opacity-90 ${isSticky ? 'scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 flex max-h-[calc(100vh-8rem)] flex-col  overflow-y-auto' : ''}`}
	>
		<div
			class="mb-2 flex flex-none flex-row items-center justify-between border-b border-white/10 menu-title px-2 py-2"
		>
			<span class="text-primary uppercase"><i class="fa-solid fa-archive"></i> Archive</span>
			{#if selectedYear !== null || activeSearchQuery || singlePostId}
				<ButtonGlass class="h-6 min-h-0 px-3 py-1 text-xs" onclick={clearFilters}
					>Show All</ButtonGlass
				>
			{/if}
		</div>
		<div class={`${isSticky ? 'flex-1  pr-1' : ''}`}>
			<ul class="w-full">
				{#each allGroupedPosts as group}
					<li>
						<button
							class={`btn mb-1 h-auto min-h-0 w-full justify-between py-2 btn-ghost hover:border hover:border-white/10 hover:bg-white/5 ${selectedYear === group.year && selectedMonthIndex === null ? 'btn-active border border-white/10 bg-white/10' : ''}`}
							onclick={() => selectFilter(group.year)}
						>
							<span class="font-bold">{group.year}</span>
							<BadgeGlass class="pointer-events-none"
								>{group.months.reduce((acc, m) => acc + m.posts.length, 0)}</BadgeGlass
							>
						</button>

						{#if selectedYear === group.year}
							<ul class="ml-4 border-l border-white/10 pl-2">
								{#each group.months as monthGroup}
									<li>
										<button
											class={`btn mb-1 h-auto min-h-0 w-full justify-between py-1 btn-ghost btn-xs hover:border hover:border-white/10 hover:bg-white/5 ${
												selectedYear === group.year && selectedMonthIndex === monthGroup.monthIndex
													? 'btn-active border border-white/10 bg-white/10 text-primary'
													: ''
											}`}
											onclick={(e) => {
												e.stopPropagation();
												selectFilter(group.year, monthGroup.monthIndex);
											}}
										>
											<span>{monthGroup.monthName}</span>
											<BadgeGlassBlack class="pointer-events-none px-2 py-0.5 text-[0.6rem]"
												>{monthGroup.posts.length}</BadgeGlassBlack
											>
										</button>
									</li>
								{/each}
							</ul>
						{/if}
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
					<i class="fa-solid fa-message"></i> Posts
				</h2>
				<p>Lucian's Blog Posts</p>
			</div>

			<div class="form-control w-full">
				<div class="join w-full">
					<input
						type="text"
						placeholder="Search posts..."
						class="input-bordered input join-item w-full border-white/10 bg-black/40 text-white backdrop-blur-md transition-all duration-300 focus:border-white/20 focus:bg-black/60"
						bind:value={searchQuery}
						onkeydown={handleSearchKeydown}
					/>
					<ButtonGlassBlack
						class="join-item rounded-l-none border-l-0 px-4"
						onclick={performSearch}
						aria-label="Search"
					>
						<i class="fa-solid fa-magnifying-glass"></i>
					</ButtonGlassBlack>
				</div>
			</div>

			{#if singlePostId || activeSearchQuery || selectedYear !== null}
				<div class="flex items-center gap-2">
					<span class="text-sm opacity-70">
						{#if singlePostId}
							Viewing single post
						{:else if activeSearchQuery}
							Search results for "{activeSearchQuery}"
						{:else if selectedYear !== null}
							Viewing {selectedYear}
							{#if selectedMonthIndex !== null}
								{new Date(2000, selectedMonthIndex).toLocaleString('default', { month: 'long' })}
							{/if}
						{/if}
					</span>
					<ButtonGlass class="h-6 min-h-0 gap-2 px-3 py-1 text-xs" onclick={clearFilters}>
						<i class="fa-solid fa-times"></i> Clear
					</ButtonGlass>
				</div>
			{/if}
		</div>

		<div class="w-full lg:hidden">
			{@render sidebarLegend()}
		</div>

		<div class="flex flex-col gap-8 lg:flex-row" id="main-content">
			<div class="flex flex-1 flex-col gap-12">
				{#if isLoading}
					<div class="flex items-center justify-center py-20">
						<span class="loading loading-lg loading-spinner text-primary"></span>
					</div>
				{:else}
					{#if groupedDisplayedPosts.length === 0}
						<ContainerGlassBlack class="alert flex w-full flex-row items-center justify-center">
							<div class="flex items-center justify-between gap-2">
								<div class="flex items-center gap-2 text-start">
									<i class="fa-solid fa-circle-exclamation"></i>
									<span>No posts found.</span>
								</div>
								<ButtonGlass class="h-8 gap-2 px-3 text-xs" onclick={clearFilters}>
									<i class="fa-solid fa-arrow-left"></i>
									See All Posts
								</ButtonGlass>
							</div>
						</ContainerGlassBlack>
					{/if}

					{#each groupedDisplayedPostsLimited as group}
						<div id={`year-${group.year}`} class="flex scroll-mt-24 flex-col gap-8">
							<div class="flex items-center gap-4">
								<h3 class="text-4xl font-bold">{group.year}</h3>
								<div class="h-px flex-1 bg-base-content/70"></div>
							</div>

							{#each group.months as monthGroup}
								<div
									id={`month-${group.year}-${monthGroup.monthName}`}
									class="flex scroll-mt-24 flex-col gap-8"
								>
									<div class="flex items-center gap-2">
										<h4 class="text-xl font-bold text-primary uppercase">{monthGroup.monthName}</h4>
										<span class="badge badge-ghost text-xs">{monthGroup.posts.length}</span>
									</div>

									<div class="flex flex-col gap-8">
										{#each monthGroup.posts as post}
											<ContainerGlassBlack
												id={`post-${post.id}`}
												role="article"
												class="scroll-mt-24 p-6"
											>
												<header class="mb-4">
													<div class="flex items-start justify-between gap-4">
														<h3 class="text-2xl font-bold text-primary">
															<!-- eslint-disable-next-line svelte/no-at-html-tags -->{@html twemojiParse(
																post.title
															)}
														</h3>
														<ButtonGlass
															class="h-8 shrink-0 gap-2 px-3 text-xs"
															onclick={() => copyPostLink(post.id)}
															aria-label="Copy link to post"
															title="Copy link to post"
														>
															{#if copiedPostId === post.id}
																<i class="fa-solid fa-check"></i>
																<span>Copied Link to Post</span>
															{:else}
																<i class="fa-solid fa-share-nodes"></i>
																Share
															{/if}
														</ButtonGlass>
													</div>
													<div class="mt-2 flex flex-wrap items-center gap-4 text-sm font-bold">
														<span class="flex items-center gap-2">
															<i class="fa-regular fa-calendar"></i>
															{safeDate(post.date).toLocaleDateString('en-GB', {
																day: 'numeric',
																month: 'long',
																year: 'numeric'
															})}
														</span>
														{#if post.tags}
															<div class="flex gap-2">
																{#each post.tags as tag}
																	<BadgeGlass
																		><!-- eslint-disable-next-line svelte/no-at-html-tags -->{@html twemojiParse(
																			tag
																		)}</BadgeGlass
																	>
																{/each}
															</div>
														{/if}
													</div>
												</header>

												<div class="flex flex-col gap-4">
													{#if post.htmlItems}
														{@const allPostMedia = getAllPostImages(post)}
														{#each post.htmlItems as item}
															{#if item.type === HtmlType.Media && item.medias}
																<ImageViewer media={mapMediaItems(item.medias)} {allPostMedia} />
															{:else if item.type === HtmlType.Paragraph}
																<!-- eslint-disable-next-line svelte/no-at-html-tags -->
																<p class="leading-relaxed">
																	{@html twemojiParse(item.htmlContent)}
																</p>
															{:else if item.type === HtmlType.Header}
																<!-- eslint-disable-next-line svelte/no-at-html-tags -->
																<h4 class="mt-4 mb-2 text-lg font-bold text-primary">
																	{@html twemojiParse(item.htmlContent)}
																</h4>
															{:else if item.type === HtmlType.List}
																<ul
																	class="line-height-loose marker: flex list-outside list-none flex-col overflow-hidden rounded-lg"
																>
																	{#if item.htmlContents}
																		{#each item.htmlContents as listItem, index}
																			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
																			<li
																				class="overflow-auto bg-secondary/75 px-4 py-3 text-secondary-content hover:bg-secondary"
																			>
																				{@html twemojiParse(listItem)}
																			</li>
																		{/each}
																	{/if}
																</ul>
															{:else if item.type === HtmlType.ButtonRow && item.buttons}
																<div class="flex flex-wrap gap-2">
																	{#each item.buttons as button}
																		<ButtonGlass
																			href={button.url}
																			openNewWindow={button.openNewTab}
																			class="h-8 gap-2 px-3 text-xs"
																		>
																			{#if button.faIcon}
																				<i class={button.faIcon} aria-hidden="true"></i>
																			{/if}
																			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
																			{@html twemojiParse(button.htmlContent)}
																		</ButtonGlass>
																	{/each}
																</div>
															{/if}
														{/each}
													{/if}
												</div>
											</ContainerGlassBlack>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{/each}
				{/if}
				{#if !singlePostId && filteredPosts.length > visibleCount}
					<div class="flex justify-center">
						<ButtonGlass
							class="w-48"
							onclick={() => (visibleCount = Math.min(visibleCount + 8, filteredPosts.length))}
						>
							Load more
						</ButtonGlass>
					</div>
				{/if}
			</div>

			<div class="hidden flex-none lg:block lg:w-64">
				<div class="sticky top-24">
					{@render sidebarLegend(true)}
				</div>
			</div>
		</div>
		{#if singlePostId && groupedDisplayedPosts.length !== 0}
			<div class="flex w-full justify-start lg:w-[calc(100%-18rem)]">
				<ButtonGlass class="w-full gap-2 text-lg" onclick={clearFilters}>
					<i class="fa-solid fa-arrow-left"></i> See All Posts
				</ButtonGlass>
			</div>
		{/if}
	</Container>
</section>

<section id="footer" class="bg-black/60 shadow-md backdrop-blur-md">
	<Footer />
</section>

<style scoped>
	section.content-section {
		padding: 1rem 0;
	}
</style>
