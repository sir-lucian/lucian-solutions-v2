<script lang="ts">
	import ContainerGlassBlack from "./containers/ContainerGlassBlack.svelte";
    import type { Art } from '$lib';

    export let artists: { name: string; slug?: string | null; items: Art[] }[] = [];
    export let selectedArtist: string | null = null;
    export let onSelect: ((artistName: string) => void) | undefined = undefined;

    function handleClick(name: string) {
        if (onSelect) {
            onSelect(name);
        }
    }
</script>
<ContainerGlassBlack class="p-4">
    <h2 class="text-2xl font-bold text-primary mb-4 inline-flex items-center gap-1">
        <i class="fa fa-paintbrush"></i> Contributors
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {#each artists as artist (artist.name)}
            <button 
                class="btn btn-sm {selectedArtist === artist.name ? 'btn-primary' : 'bg-black/50 hover:border-primary/50'} w-full justify-start"
                onclick={() => handleClick(artist.name)}
            >
                <div class="w-full flex items-center justify-start overflow-hidden gap-1">
                    <i class="fa fa-user"></i>
                    <div class="grow truncate text-left text-xs {selectedArtist === artist.name ? '' : 'text-white'}">{artist.name}{artist.slug ? ` (${artist.slug})` : ''}</div>
                </div>
            </button>
        {/each}
    </div>
</ContainerGlassBlack>