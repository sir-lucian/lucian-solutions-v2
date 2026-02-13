<script lang="ts">
	import MenuItems from '$lib/assets/menu-items/menu-items.json';
	import Footer from '$lib/components/Footer.svelte';
	import SocialButtons from '$lib/components/SocialButtons.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import ScrollDownArrow from '$lib/components/ScrollDownArrow.svelte';
	import Container from '$lib/components/Container.svelte';
	import YouTubeEmbed from '$lib/components/YouTubeEmbed.svelte';

	const menuItems: { title: string; path: string; icon: string; href: string }[] =
		MenuItems.menus.map((item) => ({
			...item,
			href: item.path === '/' ? '/' : `/${item.path}`
		}));

	let isHovering: boolean = false;
	let showEmail: boolean = false;

	const logoPath: string = '/assets/ls-logo.png';
	const listFormat: string = 'inline-flex gap-2';
</script>

<SEO title="" description="Plan the work, work the plan" />

<section id="video-background">
	<video autoplay muted loop class="h-full w-full object-cover">
		<source src="/assets/ls-video-bg.mp4" type="video/mp4" />
	</video>
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
				class="neon-glow h-8 w-8 -translate-y-0.5"
				loading="lazy"
			/>
			<h1 class="neon-glow font-bold tracking-widest uppercase">Lucian Solutions</h1>
		</div>
	</section>
	<section id="middle">
		<div class="relative">
			<h1 class="text-6xl md:text-8xl text-white leading-[0.7] tracking-tighter opacity-100 font-black font-roboto uppercase select-none text-nowrap text-center">
				Lucian
			</h1>
			<div class="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center -rotate-1 -translate-x-1 select-none">
				<p class="text-5xl md:text-7xl text-nowrap font-cursive text-shadow-xl">Lucian Solutions</p>
			</div>

		</div>
		<h2 class="subtitle">Karn Lucian Kamolnavin</h2>
		<p>
			Developer ⨉ Guest pattern designer of <a
				class="hover:text-primary"
				href="https://store.steampowered.com/app/960170/DJMAX_RESPECT_V/"
				>DJMax Respect V <i class="fa-solid fa-link"></i></a
			>
		</p>
		<SocialButtons />
		<p class="flex flex-wrap justify-center gap-4">
			{#each menuItems.filter((item) => item.title !== 'Home') as item}
				<a href={`${item.href.startsWith('#') ? './' : ''}${item.path}`}>
					<button class="btn gap-1 btn-accent"
						><i class={`${item.icon} icon-fix`}></i>{item.title}</button
					>
				</a>
			{/each}
		</p>
	</section>
	<section id="bottom">
		<ScrollDownArrow visible={isHovering} />
	</section>
</section>

<section id="about" class="content-section">
	<Container id="about-me-section">
		<div class="flex w-full flex-row flex-wrap items-center justify-center gap-6 lg:flex-nowrap">
			<img
				src="/assets/ls-avatar.jpg"
				alt="Karn Lucian Kamolnavin"
				class="my-4 h-64 w-64 rounded-full shadow-lg md:h-80 md:w-80"
				loading="lazy"
			/>
			<div class="mx-6 flex grow flex-col justify-center gap-4">
				<h2 class="neon-glow text-3xl font-bold text-primary">
					<i class="fa-solid fa-user" aria-hidden="true"></i> About Me
				</h2>
				<p class="text-lg leading-relaxed">
					Greetings! I'm <strong class="neon-glow text-primary">Karn Lucian Kamolnavin</strong>,
					also known as <strong class="neon-glow text-primary">Lucian</strong> in the developer
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
				<div class="divider-base-content divider">◆◆◆</div>
				<h2 class="neon-glow text-3xl font-bold text-primary">
					<i class="fa-solid fa-tools" aria-hidden="true"></i> Skills & Expertise
				</h2>
				<ul
					class="line-height-loose marker:neon-glow flex list-outside list-none flex-col gap-2 marker:translate-y-0.5 marker:text-primary marker:content-['▹']"
				>
					<li class={listFormat}>
						<i class="fa-solid fa-code translate-y-0.5" aria-hidden="true"></i><strong
							class="neon-glow text-primary">Frontend Web Development</strong
						> - Svelte, SvelteKit, TypeScript, JavaScript, NodeJS, Docker, etc.
					</li>
					<li class={listFormat}>
						<i class="fa-solid fa-paintbrush translate-y-0.5" aria-hidden="true"></i>
						<strong class="neon-glow text-primary">UI/UX design</strong> - ensuring user-friendly and
						visually appealing interfaces.
					</li>
					<li class={listFormat}>
						<i class="fa-solid fa-gamepad translate-y-0.5" aria-hidden="true"></i>
						<strong class="neon-glow text-primary">Game Design</strong> - particularly in creating fun
						and engaging patterns for vertical scrolling rhythm games.
					</li>
					<li class={listFormat}>
						<i class="fa-solid fa-palette translate-y-0.5" aria-hidden="true"></i>
						<strong class="neon-glow text-primary">Art & Illustration</strong> - digital art, and character
						design.
					</li>
				</ul>
			</div>
		</div>
	</Container>
</section>

<section class="content-section">
	<Container>
		<h2 class="neon-glow text-3xl font-bold text-primary">
			<i class="fa-solid fa-briefcase"></i> Public Portfolio
		</h2>

		<div class="flex flex-row">
			<YouTubeEmbed width="w-1/2" videoFooter="Video by BROKENPASTEL">
				<iframe
					width="100%"
					height="100%"
					src="https://www.youtube.com/embed/2VpbmLSBFvQ?si=UVeJ_PwzYIWO4Fws"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</YouTubeEmbed>
			<div class="flex w-1/2 flex-col items-start justify-center gap-2">
				<div class="mx-4 flex flex-col gap-2">
					<h3 class="neon-glow text-xl font-bold text-primary">DJMax Respect V</h3>
					<p>
						Guest pattern designer for DJMax Respect V, a vertical scrolling rhythm game developed
						by NEOWIZ.
					</p>
					<p>Contributed as:</p>
					<ul
						class="line-height-loose marker:neon-glow flex list-outside list-none flex-col gap-2 marker:translate-y-0.5 marker:text-primary marker:content-['▹']"
					>
						<li class={listFormat}>
							<i class="fa-solid fa-trophy" aria-hidden="true"></i>DPC (DJMax Pattern-Design
							Contest) - 2022 (6th), 2023 (1st)
						</li>
						<li class={listFormat}>
							<i class="fa-solid fa-user" aria-hidden="true"></i>Guest pattern designer
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="flex flex-row-reverse">
			<YouTubeEmbed width="w-1/2">
				<iframe
					width="100%"
					height="100%"
					src="https://www.youtube.com/embed/PLwBY5Zr_1o?si=6wYtsrhkFFdMmMbz"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
			</YouTubeEmbed>
			<div class="flex w-1/2 flex-col items-end text-end justify-center gap-2">
				<div class="mx-4 flex flex-col gap-2">
					<h3 class="neon-glow text-xl font-bold text-primary">VTuber Layouts</h3>
					<p>Contributed VTuber overlay layouts for KurosawaSP</p>
					<ul
						class="line-height-loose marker:neon-glow flex list-outside list-none flex-col gap-2 marker:translate-y-0.5 marker:text-primary marker:content-['▹']"
					>
						<li class="{listFormat} flex-row-reverse">
							<a
								href="https://www.youtube.com/@KurosawaSP"
								target="_blank"
								class="hover:text-primary {listFormat}"
								>YouTube<i class="fa-brands fa-youtube translate-y-0.5" aria-hidden="true"></i></a
							>
						</li>
						<li class="{listFormat} flex-row-reverse">
							<a href="https://twitch.tv/kurosawasp" target="_blank" class="hover:text-primary {listFormat}"
								>Twitch<i class="fa-brands fa-twitch translate-y-0.5" aria-hidden="true"></i></a
							>
						</li>
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
	section#home {
		display: flex;
		position: relative;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		height: 100vh;
		background: rgba(0, 0, 0, 0.75);
	}

	section#about {
		display: flex;
		position: relative;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
	}
	section#video-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: -1;
	}

	section#top,
	section#middle,
	section#bottom,
	section#footer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		justify-content: center;
		align-items: center;
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
</style>
