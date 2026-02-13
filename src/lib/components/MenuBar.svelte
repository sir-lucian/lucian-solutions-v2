<script lang="ts">
	import { slide } from 'svelte/transition';
	import SiteLogo from './SiteLogo.svelte';

	let scrollY = $state(0);
	let innerHeight = $state(0);

	let showMenu = $derived(scrollY > innerHeight * 0.85);
</script>

<svelte:window bind:scrollY bind:innerHeight />

{#if showMenu}
	<header
		transition:slide={{ axis: 'y', duration: 300 }}
		class="navbar fixed top-0 left-0 right-0 z-50 glass bg-base-100/90 shadow-md backdrop-blur-md"
	>
		<div class="flex-1">
			<SiteLogo width="w-full justify-start" keepNeonGlow={false} />
		</div>
		<div class="flex-none hidden sm:block">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/">Home</a></li>
				<li><a href="/about">About</a></li>
				<li><a href="/services">Services</a></li>
				<li><a href="/contact">Contact</a></li>
			</ul>
		</div>
		<div class="flex-none sm:hidden">
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
				</div>
				<ul tabindex="-1" class="menu menu-sm dropdown-content mt-3 z-1 w-52 rounded-box bg-base-100 p-2 shadow">
					<li><a href="/">Home</a></li>
					<li><a href="/about">About</a></li>
					<li><a href="/services">Services</a></li>
					<li><a href="/contact">Contact</a></li>
				</ul>
			</div>
		</div>
	</header>
{/if}
