<script lang="ts">
	import { type Snippet } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import Container from '$lib/components/Container.svelte';
	import ImageViewer from '$lib/components/ImageViewer.svelte';
	import postsData from '$lib/assets/post-items/post-items.json';
	import { MASTER_URL_PREFIX } from '$lib';

	// Helper function to map JSON media item to Media interface
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
				imgLazyLoad: m.lazy || true
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

	interface Post {
		id: string;
		title: string;
		date: string;
		slug: string;
		tags: string[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		htmlItems: any[];
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

	// Sort posts by date descending first
	const sortedPosts = [...postsData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	) as Post[];

	// Initial grouping for sidebar (always shows all available posts structure)
	const allGroupedPosts: YearGroup[] = [];
	sortedPosts.forEach((post) => {
		const date = new Date(post.date);
		const year = date.getFullYear();
		const monthIndex = date.getMonth();
		const monthName = date.toLocaleString('default', { month: 'long' });

		let yearGroup = allGroupedPosts.find((g) => g.year === year);
		if (!yearGroup) {
			yearGroup = { year, months: [] };
			allGroupedPosts.push(yearGroup);
		}

		let monthGroup = yearGroup.months.find((m) => m.monthIndex === monthIndex);
		if (!monthGroup) {
			monthGroup = { monthName, monthIndex, posts: [] };
			yearGroup.months.push(monthGroup);
		}

		monthGroup.posts.push(post);
	});
	
	// Ensure groups are sorted correctly for display stability
	allGroupedPosts.sort((a, b) => b.year - a.year);
	allGroupedPosts.forEach(yearGroup => {
		yearGroup.months.sort((a, b) => b.monthIndex - a.monthIndex);
		yearGroup.months.forEach(monthGroup => {
			monthGroup.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		});
	});

	let searchQuery = $state('');
	let activeSearchQuery = $state('');
	let selectedYear: number | null = $state(null);
	let selectedMonthIndex: number | null = $state(null);
	let singlePostId: string | null = $state(null);
	let copiedPostId: string | null = $state(null);
	let copyTimeout: NodeJS.Timeout;
	let isInitialized = $state(false);

	$effect(() => {
		const s = page.url.searchParams.get('s');
		singlePostId = s || null;
		
		// If accessing directly via URL or navigation, ensure state is consistent
		if (singlePostId) {
			searchQuery = '';
			activeSearchQuery = '';
			selectedYear = null;
			selectedMonthIndex = null;
		}
		isInitialized = true;
	});

	let filteredPosts = $derived.by(() => {
		if (!isInitialized) return [];
		
		let posts = sortedPosts;

		if (singlePostId) {
			return posts.filter((p) => p.id === singlePostId);
		}

		if (activeSearchQuery) {
			const q = activeSearchQuery.toLowerCase();
			posts = posts.filter((p) => p.title.toLowerCase().includes(q));
		} else if (selectedYear !== null) {
			posts = posts.filter((p) => {
				const d = new Date(p.date);
				if (d.getFullYear() !== selectedYear) return false;
				if (selectedMonthIndex !== null && d.getMonth() !== selectedMonthIndex) return false;
				return true;
			});
		}

		return posts;
	});

	let groupedDisplayedPosts = $derived.by(() => {
		const groups: YearGroup[] = [];
		filteredPosts.forEach((post) => {
			const date = new Date(post.date);
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
		
		// Sort groups and months explicitly
		groups.sort((a, b) => b.year - a.year);
		groups.forEach(group => {
			group.months.sort((a, b) => b.monthIndex - a.monthIndex);
			// Posts are added in order from filteredPosts which is sorted, but explicit sort is safer
			group.months.forEach(m => {
				m.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
			});
		});

		return groups;
	});

	function clearFilters() {
		searchQuery = '';
		activeSearchQuery = '';
		selectedYear = null;
		selectedMonthIndex = null;
		singlePostId = null;
		goto('/posts', { replaceState: true });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function selectFilter(year: number, monthIndex: number | null = null) {
		selectedYear = year;
		selectedMonthIndex = monthIndex;
		searchQuery = '';
		activeSearchQuery = '';
		// If we were in single post mode, clear it but don't navigation away yet (or maybe we should?)
		// UI interaction implies leaving single post mode
		if (singlePostId) {
			singlePostId = null;
			goto('/posts', { replaceState: true });
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
		if (e.key === 'Enter') {
			performSearch();
		}
	}

	function copyPostLink(postId: string) {
		const url = new URL(window.location.href);
		url.searchParams.set('s', postId);
		navigator.clipboard.writeText(url.toString()).then(() => {
			copiedPostId = postId;
			if (copyTimeout) clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => {
				copiedPostId = null;
			}, 2000);
		}).catch(err => {
			console.error('Failed to copy: ', err);
		});
	}

	let seoProps = $derived.by(() => {
		if (singlePostId) {
			const post = sortedPosts.find((p) => p.id === singlePostId);
			if (post) {
				const images = getAllPostImages(post).filter((m) => m.type === 'image');
				const firstImage = images.length > 0 ? `${MASTER_URL_PREFIX}${images[0].imgSrc}` : undefined;
				
				return {
					title: post.title,
					description: `Read "${post.title}" on Lucian Solutions.`,
					image: firstImage
				};
			}
		}
		return {
			title: "Posts",
			description: "Lucian's blog posts"
		};
	});
</script>

<SEO {...seoProps} />

{#snippet sidebarLegend(isSticky = false)}
	<div
		class={`menu w-full rounded-box shadow-lg bg-neutral-900 border border-neutral-700 opacity-90 p-2 ${isSticky ? 'h-full flex flex-col overflow-hidden' : ''}`}
	>
		<div class="menu-title flex-none flex flex-row justify-between items-center px-2 py-2 border-b border-neutral-700 mb-2">
			<span class="text-primary uppercase"><i class="fa-solid fa-archive"></i> Archive</span>
			{#if selectedYear !== null || activeSearchQuery || singlePostId}
				<button class="btn btn-ghost btn-xs text-xs" onclick={clearFilters}>Show All</button>
			{/if}
		</div>
		<div class={`${isSticky ? 'flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-base-100 pr-1' : ''}`}>
			<ul class="w-full">
				{#each allGroupedPosts as group}
					<li>
						<!-- Year Selection -->
						<button
							class={`btn btn-ghost btn-sm w-full justify-between mb-1 ${selectedYear === group.year && selectedMonthIndex === null ? 'btn-active' : ''}`}
							onclick={() => selectFilter(group.year)}
						>
							<span class="font-bold">{group.year}</span>
							<span class="badge badge-sm badge-accent">{group.months.reduce((acc, m) => acc + m.posts.length, 0)}</span>
						</button>
						
						<!-- Months List (Always visible if year is selected or no filters active) -->
						{#if selectedYear === group.year}
							<ul class="ml-4 border-l border-neutral-700 pl-2">
								{#each group.months as monthGroup}
									<li>
										<button
											class={`btn btn-ghost btn-xs w-full justify-between mb-1 ${selectedYear === group.year &&
												selectedMonthIndex === monthGroup.monthIndex ? 'btn-active text-primary' : ''}`}
											onclick={(e) => {
												e.stopPropagation();
												selectFilter(group.year, monthGroup.monthIndex);
											}}
										>
											<span>{monthGroup.monthName}</span>
											<span class="badge badge-xs badge-secondary">{monthGroup.posts.length}</span>
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
			<div class="flex-none pt-2 border-t border-neutral-700 mt-2">
				<button 
					class="btn btn-sm btn-lucian w-full gap-2"
					onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				>
					<i class="fa-solid fa-arrow-up"></i> Go To Top
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<section class="content-section">
	<Container>
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<h2 class="text-3xl font-bold text-primary uppercase">
					<i class="fa-solid fa-message"></i> Posts
				</h2>
				<p>Lucian's blog posts</p>
			</div>

			<!-- Search Bar -->
			<div class="form-control w-full">
				<div class="join w-full">
					<input
						type="text"
						placeholder="Search posts..."
						class="input input-bordered join-item w-full bg-neutral-900 border-neutral-700"
						bind:value={searchQuery}
						onkeydown={handleSearchKeydown}
					/>
					<button 
						class="btn btn-square join-item border-neutral-700 bg-neutral-800"
						onclick={performSearch}
						aria-label="Search"
					>
						<i class="fa-solid fa-magnifying-glass"></i>
					</button>
				</div>
			</div>

			<!-- Active Filters / Reset -->
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
					<button class="btn btn-ghost btn-xs" onclick={clearFilters}>
						<i class="fa-solid fa-times"></i> Clear filters
					</button>
				</div>
			{/if}
		</div>

		<!-- Mobile Sidebar Legend -->
		<div class="lg:hidden w-full">
			{@render sidebarLegend()}
		</div>

		<div class="flex flex-col gap-8 lg:flex-row">
			<!-- Main Content -->
			<div class="flex flex-1 flex-col gap-12">
				{#if !isInitialized}
					<div class="flex justify-center items-center py-20">
						<span class="loading loading-spinner loading-lg text-primary"></span>
					</div>
				{:else}
					{#if groupedDisplayedPosts.length === 0}
						<div class="alert shadow-lg border border-neutral-700 bg-neutral-900 text-center flex justify-between">
							<div>
								<i class="fa-solid fa-circle-exclamation"></i>
								<span>No posts found.</span>
							</div>
							<button class="btn btn-lucian" onclick={clearFilters}><i class="fa-solid fa-arrow-left"></i>See all posts</button>
						</div>
					{/if}

					{#each groupedDisplayedPosts as group}
					<div id={`year-${group.year}`} class="flex flex-col gap-8 scroll-mt-24">
						<div class="flex items-center gap-4">
							<h3 class="text-4xl font-bold">{group.year}</h3>
							<div class="h-px flex-1 bg-base-content/70"></div>
						</div>

						{#each group.months as monthGroup}
							<div
								id={`month-${group.year}-${monthGroup.monthName}`}
								class="flex flex-col gap-8 scroll-mt-24"
							>
								<div class="flex items-center gap-2">
									<h4 class="text-xl font-bold text-primary uppercase">{monthGroup.monthName}</h4>
									<span class="badge badge-ghost text-xs">{monthGroup.posts.length}</span>
								</div>

								<div class="flex flex-col gap-8">
									{#each monthGroup.posts as post}
										<article
											id={`post-${post.id}`}
											class="scroll-mt-24 rounded-lg p-6 shadow-md bg-neutral-900 border border-neutral-700"
										>
											<header class="mb-4">
												<div class="flex items-start justify-between gap-4">
													<h3 class="text-2xl font-bold text-primary">{post.title}</h3>
													<button
														class="btn btn-ghost gap-2 shrink-0"
														onclick={() => copyPostLink(post.id)}
														aria-label="Copy link to post"
														title="Copy link to post"
													>
														{#if copiedPostId === post.id}
															<i class="fa-solid fa-check text-success"></i>
															<span class="text-success">Copied</span>
														{:else}
															<i class="fa-solid fa-share-nodes"></i>
															Share
														{/if}
													</button>
												</div>
												<div
													class="mt-2 flex flex-wrap items-center gap-4 text-sm font-bold"
												>
													<span class="flex items-center gap-2">
														<i class="fa-regular fa-calendar"></i>
														{new Date(post.date).toLocaleDateString('en-GB', {
															day: 'numeric',
															month: 'long',
															year: 'numeric'
														})}
													</span>
													{#if post.tags}
														<div class="flex gap-2">
															{#each post.tags as tag}
																<span class="badge badge-outline badge-sm">{tag}</span>
															{/each}
														</div>
													{/if}
												</div>
											</header>


											<div class="flex flex-col gap-4">
												{#if post.htmlItems}
													{@const allPostMedia = getAllPostImages(post)}
													{#each post.htmlItems as item}
														{#if item.type === 'media' && item.medias}
															<ImageViewer media={mapMediaItems(item.medias)} allPostMedia={allPostMedia} />
														{:else if item.type === 'paragraph'}
															<!-- eslint-disable-next-line svelte/no-at-html-tags -->
															<p class="leading-relaxed">{@html item.htmlContent}</p>
														{:else if item.type === 'list'}
															<ul
																class="line-height-loose marker: flex list-outside list-none flex-col rounded-lg overflow-hidden"
															>
																{#if item.htmlContents}
																	{#each item.htmlContents as listItem, index}
																		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
																		<li class="px-4 py-3 bg-secondary/75 text-secondary-content hover:bg-secondary overflow-auto">{@html listItem}</li>
																	{/each}
																{/if}
															</ul>
														{:else if item.type === 'button-row' && item.buttons}
															<div class="flex flex-wrap gap-2">
																{#each item.buttons as button}
																	<a
																		href={button.url}
																		target={button.openNewTab ? '_blank' : '_self'}
																		class="btn btn-accent btn-sm gap-2"
																	>
																		{#if button.faIcon}
																			<i class={button.faIcon} aria-hidden="true"></i>
																		{/if}
																		{button.htmlContent}
																	</a>
																{/each}
															</div>
														{/if}
													{/each}
												{/if}
											</div>
										</article>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/each}
			{/if}
			</div>

		<!-- Sidebar Legend (Visible only on large screens) -->
			<div class="hidden flex-none lg:block lg:w-64">
				<div
					class="sticky top-24 h-[calc(100vh-8rem)]"
				>
					{@render sidebarLegend(true)}
				</div>
			</div>
		</div>
		{#if singlePostId}
			<div class="flex justify-start w-full lg:w-[calc(100%-18rem)]">
				<button class="btn btn-lucian btn-lg w-full" onclick={clearFilters}>
					<i class="fa-solid fa-arrow-left"></i> See All Posts
				</button>
			</div>
		{/if}
	</Container>
</section>

<section id="footer">
	<Footer />
</section>

<style scoped>
	section.content-section {
		padding: 1rem 0;
	}
</style>
