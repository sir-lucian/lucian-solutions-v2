<script lang="ts">
	import { onMount } from 'svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import Container from '$lib/components/Container.svelte';
	import ImageViewer from '$lib/components/ImageViewer.svelte';
	import postsData from '$lib/assets/post-items/post-items.json';

	// Helper function to map JSON media item to Media interface
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function mapMediaItems(jsonMedias: any[]): any[] {
		return jsonMedias.map((m) => ({
			type: m.type,
			imgSrc: m.src,
			altText: m.alt,
			embededUrl: m.embededUrl,
			imgLazyLoad: m.lazy || true
		}));
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

	// Group posts by Year and Month
	const groupedPosts: YearGroup[] = [];

	// Sort posts by date descending first
	const sortedPosts = [...postsData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	) as Post[];

	sortedPosts.forEach((post) => {
		const date = new Date(post.date);
		const year = date.getFullYear();
		const monthIndex = date.getMonth();
		const monthName = date.toLocaleString('default', { month: 'long' });

		let yearGroup = groupedPosts.find((g) => g.year === year);
		if (!yearGroup) {
			yearGroup = { year, months: [] };
			groupedPosts.push(yearGroup);
		}

		let monthGroup = yearGroup.months.find((m) => m.monthIndex === monthIndex);
		if (!monthGroup) {
			monthGroup = { monthName, monthIndex, posts: [] };
			yearGroup.months.push(monthGroup);
		}

		monthGroup.posts.push(post);
	});

	let activeYear = $state(groupedPosts[0]?.year);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const year = parseInt(entry.target.id.split('-')[1]);
						if (!isNaN(year)) {
							activeYear = year;
						}
					}
				});
			},
			{
				root: null,
				rootMargin: '-20% 0px -60% 0px',
				threshold: 0
			}
		);

		groupedPosts.forEach((group) => {
			const element = document.getElementById(`year-${group.year}`);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	});
</script>

<SEO title="Posts" description="Lucian's blog posts" />

<section class="content-section">
	<Container>
		<div class="mb-8 flex flex-col gap-2">
			<h2 class="text-3xl font-bold text-primary uppercase">
				<i class="fa-solid fa-message"></i> Posts
			</h2>
			<p>Lucian's blog posts</p>
		</div>

		<div class="flex flex-col gap-8 lg:flex-row">
			<!-- Main Content -->
			<div class="flex flex-1 flex-col gap-12">
				{#each groupedPosts as group}
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
												<h3 class="text-2xl font-bold text-primary">{post.title}</h3>
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

											<div class="flex flex-col gap-6">
												{#if post.htmlItems}
													{#each post.htmlItems as item}
														{#if item.type === 'media' && item.medias}
															<ImageViewer media={mapMediaItems(item.medias)} />
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
			</div>

			<!-- Sidebar Legend (Visible only on large screens) -->
			<div class="hidden flex-none lg:block lg:w-64">
				<div class="sticky top-24">
					<ul class="menu w-full rounded-box shadow-lg bg-neutral-900 border border-neutral-700 opacity-90">
						<li><h2 class="menu-title text-primary uppercase"><i class="fa-solid fa-archive"></i> Archive</h2></li>
						{#each groupedPosts as group}
							<li>
								<a href={`#year-${group.year}`} class="font-bold">{group.year}</a>
								<ul>
									{#each group.months as monthGroup}
										<li>
											<a href={`#month-${group.year}-${monthGroup.monthName}`}>
												{monthGroup.monthName}
												<span class="badge badge-sm badge-ghost ml-auto"
													>{monthGroup.posts.length}</span
												>
											</a>
										</li>
									{/each}
								</ul>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</Container>
</section>

<section id="footer">
	<Footer />
</section>

<style scoped>
	section.content-section {
		padding: 2rem 0;
	}
</style>
