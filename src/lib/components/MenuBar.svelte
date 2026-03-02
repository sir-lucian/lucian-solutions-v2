<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import SiteLogo from './SiteLogo.svelte';
	import ButtonGlass from '$lib/components/buttons/ButtonGlass.svelte';
	import menuItemsData from '$lib/assets/menu-items/menu-items.json';
	import { page } from '$app/state';
	import { pageLoading } from '$lib/stores/pageLoading';
	import { isTheSamePath } from '$lib';

	let scrollY = $state(0);
	let innerHeight = $state(0);

	let showMenu = $derived(page.url.pathname !== '/' || scrollY > innerHeight * 0.85);
	let dropdownOpen = $state(false);

	$effect(() => {
		if (dropdownOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	});

	// Close dropdown when the route/pathname changes so the overlay/blur doesn't persist
	let _currentPath = '';
	$effect(() => {
		if (page.url.pathname !== _currentPath) {
			_currentPath = page.url.pathname || '';
			if (dropdownOpen) dropdownOpen = false;
		}
	});

	const closeDropdown = () => {
		if (dropdownOpen) dropdownOpen = false;
	};

	const openDropdown = () => {
		if (!dropdownOpen) dropdownOpen = true;
	};
</script>

<svelte:window bind:scrollY bind:innerHeight />

{#if showMenu}
	{#if dropdownOpen}
		<div
			tabindex="-1"
			class="fixed inset-0 z-40 bg-transparent"
			aria-hidden="true"
			onclick={closeDropdown}
		></div>
	{/if}
	<header
		transition:slide={{ axis: 'y', duration: 300 }}
		class="navbar fixed top-0 right-0 left-0 z-50 m-0 bg-black/60 p-0 shadow-md backdrop-blur-md"
	>
		<div class="flex h-full grow">
			<SiteLogo width="w-full justify-start" />
		</div>
		<div class="hidden flex-none md:block">
			<div class="mx-6 flex h-full items-center justify-end gap-4">
				{#each menuItemsData.menus as item}
					{#if item.path === '/'}
						<a href="/" class="hover:text-white" onclick={() => {
							// check if path changes, if it does, start loading
							if (!isTheSamePath(page.url.pathname, '/')) {
								pageLoading.start();
							}
						}}>
							<div class="h-full font-bold tracking-tight uppercase">
								<i class={item.icon} aria-hidden="true"></i>
								<span class="ml-1">{item.title}</span>
							</div>
						</a>
					{:else}
						<a
							href={item.path.startsWith('#') ? `./${item.path}` : `${item.path}`}
							class="hover:text-white"
							onclick={() => {
								// check if path changes, if it does, start loading
								const targetPath = item.path.startsWith('#') ? `./${item.path}` : `${item.path}`;
								if (!isTheSamePath(page.url.pathname, targetPath)) {
									pageLoading.start();
								}
							}}
						>
							<div class="h-full font-bold tracking-tight uppercase">
								<i class={item.icon} aria-hidden="true"></i>
								<span class="ml-1">{item.title}</span>
							</div>
						</a>
					{/if}
				{/each}
			</div>
		</div>
		<div class="flex-none md:hidden">
			<ButtonGlass class="mx-4" onclick={openDropdown}>
				<i class="fa-solid fa-bars" aria-hidden="true"></i>
			</ButtonGlass>
		</div>
		<div
			class="dropdown fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-start gap-6 bg-black/80 p-6 backdrop-blur-lg transition-opacity duration-300"
			class:opacity-100={dropdownOpen}
			class:opacity-0={!dropdownOpen}
			class:pointer-events-none={!dropdownOpen}
			id="dropdown-menu"
			role="dialog"
			aria-modal="true"
			tabindex="0"
		>
			<button
				type="button"
				class="self-end text-2xl text-white hover:text-gray-300 cursor-pointer"
				onclick={closeDropdown}
				aria-label="Close menu"
			>
				<i class="fa-solid fa-xmark" aria-hidden="true"></i>
			</button>

			{#each menuItemsData.menus as item}
				{#if item.path === '/'}
					<a
						href="/"
						class="w-full hover:text-white"
						onclick={() => {
							const targetPath = '/';
							if (!isTheSamePath(page.url.pathname, targetPath)) {
								pageLoading.start();
							}
							closeDropdown();
						}}
					>
						<ButtonGlass
							class="flex h-full w-full justify-between font-bold tracking-tight uppercase"
						>
							<i class={item.icon} aria-hidden="true"></i>
							<span class="ml-1">{item.title}</span>
						</ButtonGlass>
					</a>
				{:else}
					<a
						href={item.path.startsWith('#') ? `./${item.path}` : `${item.path}`}
						class="w-full hover:text-white"
						onclick={() => {
							const targetPath = item.path.startsWith('#') ? `./${item.path}` : `${item.path}`;
							if (!isTheSamePath(page.url.pathname, targetPath)) {
								pageLoading.start();
							}
							closeDropdown();
						}}
					>
						<ButtonGlass
							class="flex h-full w-full justify-between font-bold tracking-tight uppercase"
						>
							<i class={item.icon} aria-hidden="true"></i>
							<span class="ml-1">{item.title}</span>
						</ButtonGlass>
					</a>
				{/if}
			{/each}
		</div>
	</header>
{/if}
