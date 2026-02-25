<script lang="ts">
	import { onMount } from 'svelte';
	import ButtonGlass from '$lib/components/buttons/ButtonGlass.svelte';
	import MenuItems from '$lib/assets/menu-items/menu-items.json';
	import PortfolioItems from '$lib/assets/portfolio-items/portfolio-items.json';
	import Footer from '$lib/components/Footer.svelte';
	import SocialButtons from '$lib/components/SocialButtons.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import ScrollDownArrow from '$lib/components/ScrollDownArrow.svelte';
	import ContainerGlassBlack from '$lib/components/containers/ContainerGlassBlack.svelte';
	import Container from '$lib/components/Container.svelte';
	import PublicPortfolio from '$lib/components/PublicPortfolio.svelte';
	import type { PortfolioItem } from '$lib/assets/portfolio-items/Portfolio';

	const menuItems: { title: string; path: string; icon: string; href: string }[] =
		MenuItems.menus.map((item) => ({
			...item,
			href: item.path === '/' ? '/' : `/${item.path}`
		}));

	const pagePortfolioItems: PortfolioItem[] = PortfolioItems.items as PortfolioItem[];

	let isHovering: boolean = false;
	let showEmail: boolean = false;

	const logoPath: string = '/assets/ls-logo.png';

	let fontsLoaded = false;

	onMount(async () => {
		try {
			await document.fonts.ready;
			await Promise.all([
				document.fonts.load('1rem Roboto'),
				document.fonts.load('1rem "Meow Script"')
			]);
		} catch (e) {
			console.error('Font loading failed', e);
		} finally {
			fontsLoaded = true;
		}
	});

	const email = 'karnk' + '@' + 'lucian.solutions';
</script>

<SEO title="" description="Plan the work, work the plan" />

<section id="video-background">
	<video autoplay muted loop playsinline class="h-full w-full object-cover">
		<source src="/assets/ls-video-bg.mp4" type="video/mp4" />
	</video>
	<div class="absolute top-0 left-0 h-full w-full bg-black/50"></div>
</section>

<section
	id="home"
	on:mouseenter={() => (isHovering = true)}
	on:mouseleave={() => (isHovering = false)}
	aria-label="Scroll Down Indicator"
>
	<section id="top">
		<div
			class="flex w-full cursor-default items-center justify-center gap-2 text-white select-none"
		>
			<img
				src={logoPath}
				alt="Lucian Solutions Logo"
				class=" h-8 w-8 -translate-y-0.5"
				loading="lazy"
			/>
			<h1 class="font-bold tracking-widest uppercase">Lucian Solutions</h1>
		</div>
	</section>
	<section id="middle">
		<section class="content-section">
			<Container>
				<ContainerGlassBlack>
					<div
						class="relative flex flex-col items-center justify-center gap-6 py-12 px-3 text-center transition-opacity duration-1000 my-8"
					>
						<div
							class={`relative w-full my-4 ${fontsLoaded ? 'opacity-100' : 'opacity-0'}`}
							id="home-title-container"
						>
							<h1
								class="text-center text-6xl leading-[0.7] font-black tracking-tighter text-nowrap text-white uppercase opacity-100 select-none md:text-8xl"
								id="home-title"
							>
								Lucian
							</h1>
							<div
								class="absolute top-0 left-0 flex h-full w-full -translate-x-1 -rotate-1 flex-col items-center justify-center select-none"
							>
								<p id="home-title-cursive" class="font-cursive text-5xl text-nowrap md:text-7xl">
									Lucian Solutions
								</p>
							</div>
						</div>
						<div class="flex flex-col gap-2">
							<h2 class="subtitle text-center">Karn Lucian Kamolnavin</h2>
							<p class="text-center font-bold uppercase">Developer ⨉ Illustrator</p>
						</div>

						<div class="flex w-full justify-center">
							<SocialButtons />
						</div>

						<div class="flex w-full flex-wrap justify-center gap-4">
							{#each menuItems.filter((item) => item.title !== 'Home') as item}
								<ButtonGlass
									class="gap-2 px-4 py-2 text-xs font-bold text-white uppercase shadow-2xl md:px-8 md:py-4 md:text-md"
									href={item.path}
								>
									<i class={`${item.icon} icon-fix`}></i>{item.title}
								</ButtonGlass>
							{/each}
						</div>
					</div>
				</ContainerGlassBlack>
			</Container>
		</section>
	</section>
	<section id="bottom">
		<ScrollDownArrow visible={isHovering} />
	</section>
</section>

<div class="relative" id="content">
	<section id="about" class="content-section">
		<Container id="about-me-section">
			<ContainerGlassBlack class="p-8">
				<div
					class="flex w-full flex-row flex-wrap items-center justify-center gap-6 lg:flex-nowrap"
				>
					<img
						src="/assets/ls-avatar.jpg"
						alt="Karn Lucian Kamolnavin"
						class="my-4 h-64 w-64 rounded-full shadow-lg md:h-80 md:w-80"
						loading="lazy"
					/>
					<div class="mx-6 flex grow flex-col justify-center gap-4">
						<h2 class="text-3xl font-bold text-primary uppercase">
							<i class="fa-solid fa-user" aria-hidden="true"></i> About Me
						</h2>
						<p class="text-lg leading-relaxed">
							Greetings! I'm <strong class="text-primary">Karn Lucian Kamolnavin</strong>, also
							known as <strong class="text-primary">Lucian</strong> in the developer
							<i class="fa-solid fa-code" aria-hidden="true"></i>
							and art <i class="fa-solid fa-palette" aria-hidden="true"></i> community.
						</p>
						<p>
							I'm working full time as a lead frontend developer at an undisclosed state-owned
							enterprise.
						</p>
						<p>
							In my free time, I enjoy contributing to open source projects, designing patterns for
							rhythm games, making illustrations, and exploring new technologies in web development.
						</p>
						<div class="flex w-full items-center gap-2">
							<ButtonGlass
								class="gap-2 w-48 h-12 min-w-0 px-0 shrink-0"
								onclick={() => (showEmail = !showEmail)}
							>
								{#if showEmail}
									<i class="fa-solid fa-eye-slash"></i>Hide
								{:else}
									<i class="fa-solid fa-envelope"></i>Show Email
								{/if}
							</ButtonGlass>

							{#if showEmail}
								<div
									class="flex grow overflow-hidden"
								>
									<ContainerGlassBlack
										id="me"
										aria-label="Email Address"
										class="flex flex-col font-mono font-bold w-full h-12 items-center justify-center rounded-md px-3 text-sm tracking-wider"
									>
										<div class="flex w-full h-full justify-center items-center select-all">{email}</div>
									</ContainerGlassBlack>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</ContainerGlassBlack>
		</Container>
	</section>

	<section class="content-section">
		<Container>
			<h2 class="text-3xl font-bold text-primary uppercase">
				<i class="fa-solid fa-briefcase"></i> Public Portfolio
			</h2>

			<div class="flex flex-col gap-8">
				{#each pagePortfolioItems as item, index}
					<ContainerGlassBlack class="p-8">
						<PublicPortfolio
							title={item.title}
							htmlParagraphs={item.htmlParagraphs}
							media={item.media}
							reverse={index % 2 !== 0}
						/>
					</ContainerGlassBlack>

					{#if index < pagePortfolioItems.length - 1}
						<div class="divider-base-content divider my-0 lg:hidden">◆◆◆</div>
					{/if}
				{/each}
			</div>
		</Container>
	</section>
</div>

<section id="footer" class="bg-black/60 p-4 shadow-md backdrop-blur-md">
	<Footer />
</section>

<style scoped>
	section#video-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		z-index: 0;
	}

	section#home {
		display: flex;
		position: relative;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		min-height: 100vh;
		z-index: 1;
	}

	section#about {
		display: flex;
		position: relative;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		scroll-margin-top: 80px; /* adjust to match navbar height */
	}

	section#top,
	section#middle,
	section#bottom,
	section#footer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		width: 100%;
		padding: 1rem;
	}

	section.content-section {
		padding: 3rem 0;
	}

	.title {
		font-weight: bold;
	}

	.subtitle {
		font-size: 1.5rem;
		font-weight: var(--font-weight-light);
		color: var(--color-primary);
	}

	#home-title-cursive {
		clip-path: inset(0 100% 0 0);
		text-shadow: 1px 2px 1px rgba(0, 0, 0, 0.8);
		animation: typing 5s linear infinite;
	}

	@keyframes typing {
		0% {
			clip-path: inset(0 100% 0 0);
			animation-timing-function: ease-in-out;
		}
		10% {
			clip-path: inset(0 0 0 0);
			animation-timing-function: linear;
		}
		50% {
			clip-path: inset(0 0 0 0);
			animation-timing-function: ease-in-out;
		}
		60% {
			clip-path: inset(0 0 0 100%);
			animation-timing-function: linear;
		}
		70% {
			clip-path: inset(0 0 0 100%);
		}
		100% {
			clip-path: inset(0 0 0 100%);
		}
	}
	#content {
		padding-top: 1rem; /* match navbar height */
	}
</style>
