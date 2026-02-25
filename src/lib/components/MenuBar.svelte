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
</script>

<svelte:window bind:scrollY bind:innerHeight />

{#if showMenu}
	<header
		transition:slide={{ axis: 'y', duration: 300 }}
		class="navbar fixed top-0 right-0 left-0 z-50 m-0 bg-black/60 p-0 shadow-md backdrop-blur-md"
	>
		<div class="flex h-full grow">
			<SiteLogo width="w-full justify-start"/>
		</div>
		<div class="hidden flex-none md:block">
			<div class="flex h-full items-center justify-end gap-4 mx-6">
				{#each menuItemsData.menus as item}
					{#if item.path === '/'}
						<a href="/" class="hover:text-white">
							<div class="h-full uppercase tracking-tight font-bold">
								<i class={item.icon} aria-hidden="true"></i>
								<span class="ml-1">{item.title}</span>
							</div>
						</a>
					{:else}
						<a
							href={item.path.startsWith('#') ? `./${item.path}` : `${item.path}`}
							class="hover:text-white"
						>
							<div class="h-full uppercase tracking-tight font-bold">
								<i class={item.icon} aria-hidden="true"></i>
								<span class="ml-1">{item.title}</span>
							</div>
						</a>
					{/if}
				{/each}
			</div>
		</div>
		<div class="block flex-none md:hidden">
			<div class="dropdown-end dropdown">
				   <button type="button" class="btn-ghost btn text-xl hover:text-white" aria-label="Open menu" onclick={() => dropdownOpen = !dropdownOpen}>
					   <i class="fa-solid fa-bars" aria-hidden="true"></i>
				   </button>
				   <div
					   tabindex="-1"
					   class="dropdown-content rounded-box w-64 bg-black/60 backdrop-blur-md p-2 shadow-md mt-6 mr-3 flex flex-col gap-2 border border-white/10 {dropdownOpen ? '' : 'pointer-events-none'}"
					   aria-hidden={!dropdownOpen}
				   >
					   {#each menuItemsData.menus as item}
						   {#if item.path === '/'}
							   <ButtonGlass href="/" class="hover:text-white w-full h-auto justify-start font-bold {dropdownOpen ? '' : 'pointer-events-none'}">
								   <div class="h-full text-lg uppercase tracking-tight font-bold flex items-center">
									   <i class={`${item.icon} w-6 text-center`} aria-hidden="true"></i>
									   <span class="ml-1">{item.title}</span>
								   </div>
							   </ButtonGlass>
						   {:else}
							   <ButtonGlass
								   href={item.path.startsWith('#') ? `./${item.path}` : `${item.path}`}
								   class="hover:text-white w-full h-auto justify-start font-bold {dropdownOpen ? '' : 'pointer-events-none'}"
							   >
								   <div class="h-full text-lg uppercase tracking-tight font-bold flex items-center">
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
{/if}
