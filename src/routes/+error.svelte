<script lang="ts">
    import { page } from '$app/state';
    import ButtonGlass from '$lib/components/buttons/ButtonGlass.svelte';
</script>
<div class="w-full h-screen overflow-hidden flex flex-col justify-center items-center">
    <div class="flex flex-col sm:flex-row gap-4 sm:gap-1 items-start sm:items-center">
        <div class="px-4">
            <img src="/assets/ls-logo.png" alt="Lucian Solutions Logo" class="w-32 h-32" id="ls-logo-error" loading="lazy" />
        </div>
        
        <div class="divider divider-horizontal divider-base-content"></div>

        <div class="flex flex-col flex-justify-center items-start px-4 gap-2 cursor-default select-none">
            <div class="text-7xl font-bold mb-4 uppercase tracking-wide">{page.status ?? 500}</div>
            <div class="text-xl uppercase tracking-widest">{page.error?.message ?? 'An unexpected error occurred'}</div>
            <div class="flex flex-row gap-4 items-center justify-start mt-6">
                <ButtonGlass class="gap-2" onclick={() => history.back()}><i class="fa-solid fa-undo"></i>Back</ButtonGlass>
                <button class="btn btn-secondary gap-2" on:click={() => window.location.href = '/'}><i class="fa-solid fa-home"></i>Home</button>
            </div>
        </div>
    </div>
</div>