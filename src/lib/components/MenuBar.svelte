<script lang="ts">
	import { slide } from 'svelte/transition';
	import SiteLogo from './SiteLogo.svelte';
	import ButtonGlass from '$lib/components/buttons/ButtonGlass.svelte';
	import menuItemsData from '$lib/assets/menu-items/menu-items.json';
	import { page } from '$app/state';

	let scrollY = $state(0);
	let innerHeight = $state(0);

	let showMenu = $derived(page.url.pathname !== '/' || scrollY > innerHeight * 0.85);
	let dropdownOpen = $state(false);

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

	const toggleDropdown = () => {
		dropdownOpen = !dropdownOpen;
	};
</script>

<svelte:window bind:scrollY bind:innerHeight />

{#if showMenu}
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
						<a href="/" class="hover:text-white">
							<div class="h-full font-bold tracking-tight uppercase">
								<i class={item.icon} aria-hidden="true"></i>
								<span class="ml-1">{item.title}</span>
							</div>
						</a>
					{:else}
						<a
							href={item.path.startsWith('#') ? `./${item.path}` : `${item.path}`}
							class="hover:text-white"
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
		<div class="block flex-none md:hidden">
			<div class="dropdown dropdown-end">
				<button
					type="button"
					class="text-xl mr-2 btn btn-ghost hover:text-white"
					aria-label="Open menu"
					onclick={toggleDropdown}
				>
					<i class="fa-solid fa-bars" aria-hidden="true"></i>
				</button>
				<div
					tabindex="-1"
					class="dropdown-content w-64 mt-6 mr-3 flex flex-col gap-2 rounded-box border border-white/10 bg-black/60 p-2 shadow-md backdrop-blur-md {dropdownOpen
						? ''
						: 'pointer-events-none'}"
					aria-hidden={!dropdownOpen}
				>
					{#each menuItemsData.menus as item}
						{#if item.path === '/'}
							<ButtonGlass
								href="/"
								onclick={closeDropdown}
								class="h-auto w-full justify-start font-bold hover:text-white {dropdownOpen
									? ''
									: 'pointer-events-none'}"
							>
								<div class="flex h-full items-center text-lg font-bold tracking-tight uppercase">
									<i class={`${item.icon} w-6 text-center`} aria-hidden="true"></i>
									<span class="ml-1">{item.title}</span>
								</div>
							</ButtonGlass>
						{:else}
							<ButtonGlass
								href={item.path.startsWith('#') ? `./${item.path}` : `${item.path}`}
								onclick={closeDropdown}
								class="h-auto w-full justify-start font-bold hover:text-white {dropdownOpen
									? ''
									: 'pointer-events-none'}"
							>
								<div class="flex h-full items-center text-lg font-bold tracking-tight uppercase">
									<i class={`${item.icon} w-6 text-center`} aria-hidden="true"></i>
									<span class="ml-1">{item.title}</span>
								</div>
							</ButtonGlass>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</header>

	{#if dropdownOpen}
		<!-- Overlay that mutes clicks to the page when dropdown is open; clicking it closes the dropdown. -->
		<div
			class="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-all"
			onclick={closeDropdown}
			aria-hidden="true"
		></div>
	{/if}
{/if}
