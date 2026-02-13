<script lang="ts">
	import { slide } from 'svelte/transition';
	import SiteLogo from './SiteLogo.svelte';
	import menuItemsData from '$lib/assets/menu-items/menu-items.json';

	let scrollY = $state(0);
	let innerHeight = $state(0);

	let showMenu = $derived(scrollY > innerHeight * 0.85);
</script>

<svelte:window bind:scrollY bind:innerHeight />

{#if showMenu}
	<header
		transition:slide={{ axis: 'y', duration: 300 }}
		class="navbar fixed top-0 right-0 left-0 z-50 m-0 glass bg-base-100/90 p-0 shadow-md backdrop-blur-md"
	>
		<div class="flex h-full grow">
			<SiteLogo width="w-full justify-start" keepNeonGlow={false} />
		</div>
		<div class="hidden flex-none sm:block">
			<div class="flex h-full items-center justify-end gap-4 mx-6">
				{#each menuItemsData.menus as item}
					{#if item.path === '/'}
						<a href="/" class="hover:text-white">
							<div class="h-full">
								<i class={item.icon} aria-hidden="true"></i>
								<span class="ml-1">{item.title}</span>
							</div>
						</a>
					{:else}
						<a
							href={item.path.startsWith('#') ? `./${item.path}` : `${item.path}`}
							class="hover:text-white"
						>
							<div class="h-full">
								<i class={item.icon} aria-hidden="true"></i>
								<span class="ml-1">{item.title}</span>
							</div>
						</a>
					{/if}
				{/each}
			</div>
		</div>
		<div class="block flex-none sm:hidden">
			<div class="dropdown-end dropdown">
				<div tabindex="-1" class="btn-ghost btn text-xl hover:text-white">
					<i class="fa-solid fa-bars" aria-hidden="true"></i>
				</div>
				<ul
					tabindex="-1"
					class="dropdown-content menu rounded-box w-52 bg-base-100/75 p-2 shadow mt-6 mr-3"
				>
					{#each menuItemsData.menus as item}
						{#if item.path === '/'}
							<li>
								<a href="/" class="hover:text-white">
									<div class="h-full text-lg">
										<i class={item.icon} aria-hidden="true"></i>
										<span class="ml-1">{item.title}</span>
									</div>
								</a>
							</li>
						{:else}
							<li>
								<a
									href={item.path.startsWith('#') ? `./${item.path}` : `${item.path}`}
									class="hover:text-white"
								>
									<div class="h-full text-lg">
										<i class={item.icon} aria-hidden="true"></i>
										<span class="ml-1">{item.title}</span>
									</div>
								</a>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	</header>
{/if}
